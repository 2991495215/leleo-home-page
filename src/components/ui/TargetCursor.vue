<template>
  <div style="display: none;"></div>
</template>

<script>
let activeCursorInstance = null;

export default {
  name: 'TargetCursor',
  props: {
    targetSelector: {
      type: String,
      default: '.cursor-target'
    },
    hideDefaultCursor: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      cursorPos: { x: 0, y: 0 },
      renderedCursorPos: { x: 0, y: 0 },
      isTargeting: false,
      targetBounds: null,
      isVisible: false,
      activeTarget: null,
      cursorElement: null,
      animationFrameId: null,
      targetObserver: null,
      activeLeaveHandlers: [],
      isCursorActive: false,
      lastCursorPos: { x: 0, y: 0 },
      lastIsVisible: false,
      lastIsTargeting: false,
      lastCornerPositions: null
    };
  },
  computed: {
    cornerPositions() {
      if (!this.targetBounds) return null;
      const cornerSize = 12;
      const borderWidth = 3;
      return {
        topLeft: {
          x: this.targetBounds.left - this.renderedCursorPos.x - borderWidth,
          y: this.targetBounds.top - this.renderedCursorPos.y - borderWidth
        },
        topRight: {
          x: this.targetBounds.right - this.renderedCursorPos.x + borderWidth - cornerSize,
          y: this.targetBounds.top - this.renderedCursorPos.y - borderWidth
        },
        bottomRight: {
          x: this.targetBounds.right - this.renderedCursorPos.x + borderWidth - cornerSize,
          y: this.targetBounds.bottom - this.renderedCursorPos.y + borderWidth - cornerSize
        },
        bottomLeft: {
          x: this.targetBounds.left - this.renderedCursorPos.x - borderWidth,
          y: this.targetBounds.bottom - this.renderedCursorPos.y + borderWidth - cornerSize
        }
      };
    }
  },
  mounted() {
    if (activeCursorInstance && activeCursorInstance !== this) {
      return;
    }

    this.cleanupExistingCursors();
    activeCursorInstance = this;
    this.isCursorActive = true;
    
    this.createCursorElement();
    this.originalCursor = document.body.style.cursor;
    if (this.hideDefaultCursor) {
      document.body.style.cursor = 'none';
    }

    window.addEventListener('mousemove', this.handleMouseMove, { passive: true });
    window.addEventListener('mouseover', this.handleMouseOver, { passive: true });
    window.addEventListener('touchstart', this.handleTouchStart, { passive: true });
    window.addEventListener('scroll', this.handleScroll, { passive: true, capture: true });
    window.addEventListener('resize', this.handleResize, { passive: true });
  },
  beforeUnmount() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.stopTargetObserver();
    this.cleanupLeaveHandlers();
    this.destroyCursorElement();
    if (activeCursorInstance === this) {
      activeCursorInstance = null;
    }
    this.isCursorActive = false;
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('mouseover', this.handleMouseOver);
    window.removeEventListener('touchstart', this.handleTouchStart);
    window.removeEventListener('scroll', this.handleScroll, true);
    window.removeEventListener('resize', this.handleResize);
    document.body.style.cursor = this.originalCursor;
  },
  methods: {
    cleanupExistingCursors() {
      // 查找并删除所有旧的光标元素
      const existingCursors = document.querySelectorAll('.target-cursor-element, [style*="z-index: 999999999"]');
      existingCursors.forEach(el => {
        if (el.parentNode) {
          el.parentNode.removeChild(el);
        }
      });
    },
    createCursorElement() {
      // 创建光标 DOM 元素
      this.cursorElement = document.createElement('div');
      this.cursorElement.className = 'target-cursor-element';
      this.cursorElement.style.position = 'fixed';
      this.cursorElement.style.top = '0';
      this.cursorElement.style.left = '0';
      this.cursorElement.style.width = '0';
      this.cursorElement.style.height = '0';
      this.cursorElement.style.pointerEvents = 'none';
      this.cursorElement.style.zIndex = '999999999';
      this.cursorElement.style.opacity = '0';
      this.cursorElement.style.filter = 'drop-shadow(0 0 2px rgba(0, 0, 0, 0.65))';
      this.cursorElement.style.willChange = 'transform, opacity';

      // 创建中心点
      this.cursorCenter = document.createElement('div');
      this.cursorCenter.style.position = 'absolute';
      this.cursorCenter.style.left = '50%';
      this.cursorCenter.style.top = '50%';
      this.cursorCenter.style.width = '6px';
      this.cursorCenter.style.height = '6px';
      this.cursorCenter.style.background = 'white';
      this.cursorCenter.style.boxShadow = '0 0 4px rgba(255, 255, 255, 0.65)';
      this.cursorCenter.style.borderRadius = '50%';
      this.cursorCenter.style.transform = 'translate(-50%, -50%)';
      this.cursorCenter.style.animation = 'target-cursor-spin 2s linear infinite';
      this.cursorElement.appendChild(this.cursorCenter);

      // 创建四个角落
      this.cursorCorners = [];
      const cornerConfigs = [
        { borderRight: 'none', borderBottom: 'none' },
        { borderLeft: 'none', borderBottom: 'none' },
        { borderLeft: 'none', borderTop: 'none' },
        { borderRight: 'none', borderTop: 'none' }
      ];

      cornerConfigs.forEach((config) => {
        const corner = document.createElement('div');
        corner.style.position = 'absolute';
        corner.style.left = '50%';
        corner.style.top = '50%';
        corner.style.width = '12px';
        corner.style.height = '12px';
        corner.style.border = '3px solid white';
        if (config.borderRight) corner.style.borderRight = config.borderRight;
        if (config.borderBottom) corner.style.borderBottom = config.borderBottom;
        if (config.borderLeft) corner.style.borderLeft = config.borderLeft;
        if (config.borderTop) corner.style.borderTop = config.borderTop;
        corner.style.transition = 'transform 0.18s cubic-bezier(0.22, 1, 0.36, 1)';
        corner.style.willChange = 'transform';
        this.cursorElement.appendChild(corner);
        this.cursorCorners.push(corner);
      });

      // 初始化角落位置
      this.resetCornerPositions();

      // 将光标元素添加到 body
      document.body.appendChild(this.cursorElement);
    },
    resetCornerPositions() {
      const transforms = [
        'translate(-150%, -150%)',
        'translate(50%, -150%)',
        'translate(50%, 50%)',
        'translate(-150%, 50%)'
      ];
      this.cursorCorners.forEach((corner, index) => {
        corner.style.transform = transforms[index];
      });
    },
    destroyCursorElement() {
      if (this.cursorElement && this.cursorElement.parentNode) {
        this.cursorElement.parentNode.removeChild(this.cursorElement);
        this.cursorElement = null;
      }
    },
    handleMouseMove(e) {
      const wasHidden = !this.isVisible;
      this.cursorPos.x = e.clientX;
      this.cursorPos.y = e.clientY;
      if (wasHidden) {
        this.renderedCursorPos.x = e.clientX;
        this.renderedCursorPos.y = e.clientY;
        this.lastCursorPos.x = e.clientX;
        this.lastCursorPos.y = e.clientY;
      }
      if (!this.isVisible) {
        this.isVisible = true;
      }
      this.scheduleUpdate();
    },
    handleResize() {
      if (this.isTargeting && this.activeTarget) {
        this.updateTargetBounds();
        this.scheduleUpdate();
      }
    },
    handleScroll() {
      if (this.isTargeting && this.activeTarget) {
        this.updateTargetBounds();
        this.scheduleUpdate();
      }
    },
    handleTouchStart(e) {
      const touch = e.touches && e.touches[0];
      if (!touch) return;

      this.cursorPos.x = touch.clientX;
      this.cursorPos.y = touch.clientY;
      this.renderedCursorPos.x = touch.clientX;
      this.renderedCursorPos.y = touch.clientY;
      this.isVisible = true;

      const target = this.findTargetFromElement(document.elementFromPoint(touch.clientX, touch.clientY));
      if (target) {
        this.setActiveTarget(target);
      } else {
        this.clearActiveTarget();
      }

      this.scheduleUpdate();
    },
    getContentBounds(element) {
      const range = document.createRange();
      range.selectNodeContents(element);
      const rects = Array.from(range.getClientRects()).filter(rect => rect.width > 0 && rect.height > 0);
      range.detach();

      if (!rects.length) {
        return null;
      }

      return rects.reduce((bounds, rect) => ({
        left: Math.min(bounds.left, rect.left),
        top: Math.min(bounds.top, rect.top),
        right: Math.max(bounds.right, rect.right),
        bottom: Math.max(bounds.bottom, rect.bottom),
        width: Math.max(bounds.right, rect.right) - Math.min(bounds.left, rect.left),
        height: Math.max(bounds.bottom, rect.bottom) - Math.min(bounds.top, rect.top)
      }), {
        left: rects[0].left,
        top: rects[0].top,
        right: rects[0].right,
        bottom: rects[0].bottom,
        width: rects[0].width,
        height: rects[0].height
      });
    },
    updateTargetBounds() {
      if (!this.activeTarget) return;

      if (this.shouldUseContentBounds(this.activeTarget)) {
        const contentBounds = this.getContentBounds(this.activeTarget);
        if (contentBounds) {
          this.targetBounds = contentBounds;
          return;
        }
      }

      this.targetBounds = this.activeTarget.getBoundingClientRect();
    },
    shouldUseContentBounds(element) {
      return element.classList.contains('leleo-left-welcome') || element.classList.contains('leleo-typewriter') || element.classList.contains('msg');
    },
    shouldObserveTarget(target) {
      return target.classList.contains('leleo-typewriter') || target.classList.contains('msg');
    },
    observeTargetChanges(target) {
      this.stopTargetObserver();
      if (!this.shouldObserveTarget(target)) return;

      this.targetObserver = new MutationObserver(() => {
        this.updateTargetBounds();
        this.scheduleUpdate();
      });
      this.targetObserver.observe(target, {
        childList: true,
        characterData: true,
        subtree: true
      });
    },
    stopTargetObserver() {
      if (this.targetObserver) {
        this.targetObserver.disconnect();
        this.targetObserver = null;
      }
    },
    findTargetFromElement(element) {
      let current = element;

      while (current && current !== document.body) {
        if (this.isClickableButton(current) || this.isClickableText(current)) {
          return current;
        }
        current = current.parentElement;
      }

      return null;
    },
    isClickableButton(element) {
      if (!element.matches) return false;

      return element.matches('button, [role="button"], .v-btn, .v-fab, .v-tab, .v-pagination__item, .v-pagination__prev, .v-pagination__next');
    },
    isClickableText(element) {
      if (!element.matches) return false;

      const isTextElement = element.matches('a, [role="link"], span.cursor-target, span.msg, .leleo-card-title, .leleo-card-subtitle, .musicplayer-text');
      if (!isTextElement) return false;

      const hasClickableBehavior = Boolean(
        element.closest('button, [role="button"], a, [role="link"], .v-btn, .v-fab, .v-tab, .v-list-item, .v-chip, .project-card') ||
        element.matches('.cursor-target, .msg')
      );

      return hasClickableBehavior && this.getTextBounds(element);
    },
    getTextBounds(element) {
      const bounds = this.getContentBounds(element);
      if (!bounds) return null;
      if (bounds.width < 2 || bounds.height < 2) return null;
      return bounds;
    },
    clearActiveTarget() {
      this.stopTargetObserver();
      this.activeTarget = null;
      this.isTargeting = false;
      this.targetBounds = null;
    },
    setActiveTarget(target) {
      if (this.activeTarget === target) {
        this.updateTargetBounds();
        return;
      }

      this.activeTarget = target;
      this.isTargeting = true;
      this.updateTargetBounds();
      this.observeTargetChanges(target);
    },
    scheduleUpdate() {
      if (this.animationFrameId) return;

      this.animationFrameId = requestAnimationFrame(() => {
        const shouldContinue = this.updateCursorElement();
        this.animationFrameId = null;
        if (shouldContinue) {
          this.scheduleUpdate();
        }
      });
    },
    updateCursorElement() {
      if (!this.cursorElement) return false;

      let needsUpdate = false;
      const dx = this.cursorPos.x - this.renderedCursorPos.x;
      const dy = this.cursorPos.y - this.renderedCursorPos.y;
      const distance = Math.hypot(dx, dy);

      if (distance > 0.1) {
        const easing = this.isTargeting ? 0.42 : 0.5;
        this.renderedCursorPos.x += dx * easing;
        this.renderedCursorPos.y += dy * easing;
        if (Math.abs(this.cursorPos.x - this.renderedCursorPos.x) < 0.1) {
          this.renderedCursorPos.x = this.cursorPos.x;
        }
        if (Math.abs(this.cursorPos.y - this.renderedCursorPos.y) < 0.1) {
          this.renderedCursorPos.y = this.cursorPos.y;
        }
      }

      if (Math.abs(this.renderedCursorPos.x - this.lastCursorPos.x) > 0.05 || Math.abs(this.renderedCursorPos.y - this.lastCursorPos.y) > 0.05) {
        this.cursorElement.style.transform = `translate3d(${this.renderedCursorPos.x}px, ${this.renderedCursorPos.y}px, 0) translate(-50%, -50%)`;
        this.lastCursorPos.x = this.renderedCursorPos.x;
        this.lastCursorPos.y = this.renderedCursorPos.y;
        needsUpdate = true;
      }

      // 检查可见性是否变化
      if (this.isVisible !== this.lastIsVisible) {
        this.cursorElement.style.opacity = this.isVisible ? '1' : '0';
        this.lastIsVisible = this.isVisible;
        needsUpdate = true;
      }

      // 检查目标状态是否变化
      if (this.isTargeting !== this.lastIsTargeting) {
        if (!this.isTargeting) {
          this.cursorCenter.style.animation = 'target-cursor-spin 2s linear infinite';
        } else {
          this.cursorCenter.style.animation = 'none';
        }
        this.lastIsTargeting = this.isTargeting;
        needsUpdate = true;
      }

      // 检查角落位置是否变化
      const currentCornerPositions = this.isTargeting ? this.cornerPositions : null;
      const cornerPositionsChanged = JSON.stringify(currentCornerPositions) !== JSON.stringify(this.lastCornerPositions);
      
      if (cornerPositionsChanged || needsUpdate) {
        if (this.isTargeting && currentCornerPositions) {
          const transforms = [
            `translate(${currentCornerPositions.topLeft.x}px, ${currentCornerPositions.topLeft.y}px)`,
            `translate(${currentCornerPositions.topRight.x}px, ${currentCornerPositions.topRight.y}px)`,
            `translate(${currentCornerPositions.bottomRight.x}px, ${currentCornerPositions.bottomRight.y}px)`,
            `translate(${currentCornerPositions.bottomLeft.x}px, ${currentCornerPositions.bottomLeft.y}px)`
          ];
          this.cursorCorners.forEach((corner, index) => {
            corner.style.transform = transforms[index];
          });
        } else {
          this.resetCornerPositions();
        }
        this.lastCornerPositions = currentCornerPositions ? JSON.parse(JSON.stringify(currentCornerPositions)) : null;
      }

      return distance > 0.1;
    },
    handleMouseOver(e) {
      if (!this.isCursorActive) return;

      const target = this.findTargetFromElement(e.target);
      if (!target) return;
      if (this.activeTarget === target) return;

      this.cleanupLeaveHandlers();
      this.setActiveTarget(target);

      const leaveHandler = () => {
        if (this.activeTarget === target) {
          this.clearActiveTarget();
        }
        target.removeEventListener('mouseleave', leaveHandler);
        this.activeLeaveHandlers = this.activeLeaveHandlers.filter(item => item.handler !== leaveHandler);
        this.scheduleUpdate();
      };

      this.activeLeaveHandlers.push({ target, handler: leaveHandler });
      target.addEventListener('mouseleave', leaveHandler);
      this.scheduleUpdate();
    },
    cleanupLeaveHandlers() {
      this.activeLeaveHandlers.forEach(({ target, handler }) => {
        target.removeEventListener('mouseleave', handler);
      });
      this.activeLeaveHandlers = [];
    }
  }
};
</script>

<style>
/* 全局隐藏默认光标，确保所有元素都不会显示默认光标 */
html, body, * {
  cursor: none !important;
}

/* 旋转动画 */
@keyframes target-cursor-spin {
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}
</style>
