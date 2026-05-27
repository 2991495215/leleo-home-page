<template>
  <div style="display: none;"></div>
</template>

<script>
// 全局变量，确保只有一个光标实例
let cursorInstanceCount = 0;

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
      isTargeting: false,
      targetBounds: null,
      isVisible: false,
      activeTarget: null,
      cursorElement: null,
      animationFrameId: null,
      targetObserver: null,
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
          x: this.targetBounds.left - this.cursorPos.x - borderWidth,
          y: this.targetBounds.top - this.cursorPos.y - borderWidth
        },
        topRight: {
          x: this.targetBounds.right - this.cursorPos.x + borderWidth - cornerSize,
          y: this.targetBounds.top - this.cursorPos.y - borderWidth
        },
        bottomRight: {
          x: this.targetBounds.right - this.cursorPos.x + borderWidth - cornerSize,
          y: this.targetBounds.bottom - this.cursorPos.y + borderWidth - cornerSize
        },
        bottomLeft: {
          x: this.targetBounds.left - this.cursorPos.x - borderWidth,
          y: this.targetBounds.bottom - this.cursorPos.y + borderWidth - cornerSize
        }
      };
    }
  },
  mounted() {
    // 清理所有已存在的光标
    this.cleanupExistingCursors();
    
    // 检查是否已经有实例
    if (cursorInstanceCount > 0) {
      return;
    }
    
    cursorInstanceCount++;
    
    this.createCursorElement();
    this.originalCursor = document.body.style.cursor;
    if (this.hideDefaultCursor) {
      document.body.style.cursor = 'none';
    }

    window.addEventListener('mousemove', this.handleMouseMove, { passive: true });
    window.addEventListener('mouseover', this.handleMouseOver, { passive: true });
    window.addEventListener('resize', this.handleResize, { passive: true });
  },
  beforeDestroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.stopTargetObserver();
    this.destroyCursorElement();
    cursorInstanceCount--;
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('mouseover', this.handleMouseOver);
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
      this.cursorCenter.style.width = '9px';
      this.cursorCenter.style.height = '9px';
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
        corner.style.transition = 'transform 0.12s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
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
      this.cursorPos.x = e.clientX;
      this.cursorPos.y = e.clientY;
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

      if (this.activeTarget.classList.contains('leleo-left-welcome') || this.activeTarget.classList.contains('leleo-typewriter')) {
        const contentBounds = this.getContentBounds(this.activeTarget);
        if (contentBounds) {
          this.targetBounds = contentBounds;
          return;
        }
      }

      this.targetBounds = this.activeTarget.getBoundingClientRect();
    },
    observeTargetChanges(target) {
      this.stopTargetObserver();
      if (!target.classList.contains('leleo-typewriter')) return;

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
    scheduleUpdate() {
      if (this.animationFrameId) return;

      this.animationFrameId = requestAnimationFrame(() => {
        this.updateCursorElement();
        this.animationFrameId = null;
      });
    },
    updateCursorElement() {
      if (!this.cursorElement) return;

      let needsUpdate = false;

      // 检查位置是否变化
      if (this.cursorPos.x !== this.lastCursorPos.x || this.cursorPos.y !== this.lastCursorPos.y) {
        this.cursorElement.style.transform = `translate(${this.cursorPos.x}px, ${this.cursorPos.y}px) translate(-50%, -50%)`;
        this.lastCursorPos.x = this.cursorPos.x;
        this.lastCursorPos.y = this.cursorPos.y;
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
        this.lastCornerPositions = JSON.parse(JSON.stringify(currentCornerPositions));
      }
    },
    handleMouseOver(e) {
      const directTarget = e.target;
      const allTargets = [];
      let current = directTarget;

      while (current && current !== document.body) {
        if (current.matches && current.matches(this.targetSelector)) {
          allTargets.push(current);
        }
        current = current.parentElement;
      }

      const target = allTargets[0] || null;
      if (!target) return;
      if (this.activeTarget === target) return;

      this.activeTarget = target;
      this.isTargeting = true;
      this.updateTargetBounds();
      this.observeTargetChanges(target);

      const leaveHandler = () => {
        this.stopTargetObserver();
        this.activeTarget = null;
        this.isTargeting = false;
        this.targetBounds = null;
        target.removeEventListener('mouseleave', leaveHandler);
        this.scheduleUpdate();
      };

      target.addEventListener('mouseleave', leaveHandler);
      this.scheduleUpdate();
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
