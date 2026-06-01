import homeright from '../src/components/hoemright.vue';
import tab1 from './components/tabs/tab1.vue';
import tab2 from './components/tabs/tab2.vue';
import tab3 from './components/tabs/tab3.vue';
import loader from './components/loader.vue';
import polarchart from './components/polarchart.vue';
import TargetCursor from './components/ui/TargetCursor.vue';
import config from './config.js';
import { getCookie } from './utils/cookieUtils.js';
import { setMeta,getFormattedTime,getFormattedDate,dataConsole } from './utils/common.js';
import { useDisplay } from 'vuetify'

export default {
  components: {
    tab1,tab2,tab3,loader,homeright,polarchart,TargetCursor
  },
  setup() {
    const { xs,sm,md } = useDisplay();
    return { xs,sm,md };
  },
  data() {
    return {
      isloading:false,
      isClearScreen: false,
      formattedTime:"",
      formattedDate:"",
      configdata: config,
      dialog1: false,
      dialog2: false,
      dialog3: false,
      contactInfo: null,
      contactTab: 'email',
      contactTabs: [
        {
          icon: 'mdi-email',
          text: '邮箱',
          value: 'email',
        },
        {
          icon: 'mdi-qqchat',
          text: 'QQ',
          value: 'qq',
        },
        {
          icon: 'mdi-wechat',
          text: '微信',
          value: 'wechat',
        },
      ],
      personalizedtags: null,
      videosrc: '',
      ismusicplayer: false,
      isPlaying:false,
      playlistIndex: 0,
      audioLoading: false,
      musicinfo: null,
      musicinfoLoading:false,
      lyrics:{},
      socialPlatformIcons: null,
      stackicons:[
        {icon:"mdi-vuejs",color:"green", model: false,tip: 'vue'},
        {icon:"mdi-language-javascript",color:"#CAD300", model: false,tip: 'javascript'},
        {icon:"mdi-language-css3",color:"blue", model: false,tip: 'css'},
        {icon:"mdi-language-html5",color:"red", model: false,tip: 'html'},
        {icon:"$vuetify",color:"#1697F6", model: false,tip: 'vuetify'},
      ],
      projectcards:null,
      tab: null,
      tabs: [
        {
          icon: 'mdi-pencil-plus',
          text: '样式预览',
          value: 'tab-1',
          component: "tab1",
        },
        {
          icon: 'mdi-wallpaper',
          text: '背景预览',
          value: 'tab-2',
          component: "tab2",
        },
        {
          icon: 'mdi-music-circle-outline',
          text: '音乐播放',
          value: 'tab-3',
          component: "tab3",
        },
      ],

    };
  },
  async mounted() {
    if(import.meta.env.VITE_CONFIG){
      this.configdata = JSON.parse(import.meta.env.VITE_CONFIG);
    }
    this.projectcards = this.configdata.projectcards;this.socialPlatformIcons = this.configdata.socialPlatformIcons;
    this.personalizedtags = this.configdata.tags;
    this.contactInfo = this.configdata.contactInfo;
    this.isloading = true;
    let imageurl = "";
    this.dataConsole();
    this.setMeta(this.configdata.metaData.title,this.configdata.metaData.description,this.configdata.metaData.keywords,this.configdata.metaData.icon);
    
    imageurl = this.setMainProperty(imageurl);

    //异步等待背景壁纸包括视频壁纸加载完成后再显示页面
    const loadImage = () => {
        const imageUrls = [
          this.configdata.avatar,
          ...this.configdata.projectcards.map(item => item.img)
        ];
        return new Promise((resolve, reject) => {
          const imagePromises = imageUrls.map((url) => {
            return new Promise((resolve, reject) => {
                const imgs = new Image();
                imgs.src = url;
                imgs.onload = () => resolve();
                imgs.onerror = (err) => reject(err);
            });
          })

          // 设置超时机制：2.5秒
          const timeoutPromise = new Promise((resolve) => {
            setTimeout(() => {
              resolve();
            }, 2500);
          });
          
          // 等待所有图片加载完成或超时
          Promise.race([Promise.all(imagePromises), timeoutPromise]).then(()=>{
            if(imageurl){
              const img = new Image();
              img.src = imageurl;
              // resolve() 函数通将一个 Promise 对象从未完成状态转变为已完成状态
              img.onload = () => {resolve();};
              img.onerror = (err) => {reject(err);};
            }else{
              const video = this.$refs.VdPlayer;
              video.onloadedmetadata = () => {
                setTimeout(() => {
                }, "200");  
                resolve();
              };
              video.onerror = (err) => {resolve();};
            }
          })
        });
     };

    loadImage().then(() => {
        this.formattedTime =  this.getFormattedTime(new Date());
        this.formattedDate =  this.getFormattedDate(new Date());
        setTimeout(() => {
          this.isloading = false;
        }, "500");          
      }).catch((err) => {
        console.error('壁纸加载失败:', err);
        setTimeout(() => {
          this.isloading = false;
        }, "100");  
      });
 
      setInterval(() => {
        this.formattedTime =  this.getFormattedTime(new Date()) ;
      }, 1000);

      await this.getMusicInfo();  //获取音乐数据
      this.setupAudioListener();  //设置 ended 事件监听器，当歌曲播放结束时自动调用 nextTrack 方法。
  },

  beforeUnmount() {     //在组件销毁前移除事件监听器，防止内存泄漏。
    this.$refs.audioPlayer?.removeEventListener('ended',  this.nextTrack);
  },

  watch:{
    isClearScreen(val){
      if(!this.videosrc){
        return
      }
      if(val){
        this.$refs.VdPlayer.style.zIndex = 0; 
        this.$refs.VdPlayer.controls = true;
      }else{
        this.$refs.VdPlayer.style.zIndex = -100; 
        this.$refs.VdPlayer.controls = false;
      }
    },
    audioLoading(val){
      this.isPlaying = !val;
    }

  //若弹出框使得页面播放卡顿，可以先停止背景播放
  //   dialog1(val){
  //     if(val){
  //       this.$refs.VdPlayer.pause();
  //     }else{
  //       this.$refs.VdPlayer.play();
  //     }
  //  }
  },

  computed: {
    currentSong() {
      return this.musicinfo?.[this.playlistIndex];
    },
    audioPlayer() {
      return this.$refs.audioPlayer;
    }
  },
  
  methods: {
    getCookie,setMeta,getFormattedTime,getFormattedDate,dataConsole,

    applyThemeConfig(themeConfig){
      const root = document.documentElement;
      root.style.setProperty('--leleo-welcomtitle-color', `${themeConfig.color.welcometitlecolor}`);
      root.style.setProperty('--leleo-vcard-color', `${themeConfig.color.themecolor}`);
      root.style.setProperty('--leleo-brightness', `${themeConfig.brightness}%`);
      root.style.setProperty('--leleo-blur', `${themeConfig.blur}px`);
    },

    applyBackgroundConfig(backgroundConfig, deviceType){
      const root = document.documentElement;
      const background = backgroundConfig[deviceType];

      if(background.type == "pic"){
        root.style.setProperty('--leleo-background-image-url', `url('${background.datainfo.url}')`);
        return background.datainfo.url;
      }

      this.videosrc = background.datainfo.url;
      return "";
    },

    setMainProperty(imageurl){
      const leleodata = this.getCookie("leleodata");
      const leleodatabackground = this.getCookie("leleodatabackground");
      const { xs } = useDisplay();
      const themeConfig = leleodata || this.configdata;
      const backgroundConfig = leleodatabackground || this.configdata.background;
      const deviceType = xs.value ? "mobile" : "pc";

      this.applyThemeConfig(themeConfig);
      imageurl = this.applyBackgroundConfig(backgroundConfig, deviceType);
      return imageurl;
    },

    projectcardsShow(key){
      this.projectcards.forEach((item,index)=>{
        if(index!= key){
          item.show = false;
        }
      })
    },
    handleCancel(){
      this.dialog1 = false;
    },
    jump(url){
      window.open(url, '_blank').focus();
    },
    
    async getMusicInfo(){
      this.musicinfoLoading = true;
      const musicApi = this.configdata.musicPlayer.api || 'https://music.3e0.cn/';
      const params = new URLSearchParams({
        server: this.configdata.musicPlayer.server,
        type: this.configdata.musicPlayer.type,
        id: this.configdata.musicPlayer.id,
      });
      try {
        const response = await fetch(`${musicApi}?${params.toString()}`);
        if (!response.ok) {
          throw new Error('网络请求失败');
        }
        const data = await response.json();
        const songs = Array.isArray(data) ? data : data.value;
        if (!Array.isArray(songs)) {
          throw new Error(data?.message || '音乐数据格式错误');
        }
        this.musicinfo = songs.map(song => ({
          title: song.name,
          author: song.artist,
          url: song.url,
          pic: song.pic,
          lrc: song.lrc
        }));
      } catch (error) {
        console.error('请求失败:', error);
        this.musicinfo = [];
      } finally {
        this.musicinfoLoading = false;
      }
      
    },
    musicplayershow(val) {
        this.ismusicplayer = val;
    },

    setupAudioListener() {
      this.$refs.audioPlayer.addEventListener('ended', this.nextTrack);
    },

    togglePlay() {
      if (this.musicinfoLoading || !this.currentSong) {
        return;
      }
      if (!this.isPlaying) {
        this.audioPlayer.play();
        this.isVdMuted = true;
      } else {
        this.audioPlayer.pause();
        this.isVdMuted = false;
      }
      this.isPlaying = !this.musicinfoLoading && !this.isPlaying;
    },
    previousTrack() {
      if (!this.musicinfo?.length) {
        return;
      }
      this.playlistIndex = this.playlistIndex > 0 ? this.playlistIndex - 1 : this.musicinfo.length - 1;
      this.updateAudio();
    },
    nextTrack() {
      if (!this.musicinfo?.length) {
        return;
      }
      this.playlistIndex = this.playlistIndex < this.musicinfo.length - 1 ? this.playlistIndex + 1 : 0;
      this.updateAudio();
    },
    updateAudio() {
      if (!this.currentSong) {
        return;
      }
      this.audioPlayer.src = this.currentSong.url;
      this.$refs.audiotitle.innerText = this.currentSong.title;
      this.$refs.audioauthor.innerText = this.currentSong.author;
      this.isPlaying = true;
      this.audioPlayer.play();
    },
    updateCurrentIndex(index) {
      this.playlistIndex = index;
      this.updateAudio();
    },
    updateIsPlaying(isPlaying) {
      this.isPlaying = isPlaying;
    },
    updateLyrics(lyrics){
      this.lyrics = lyrics;
    },
    // 监听等待事件（缓冲不足）
    onWaiting() {
      this.audioLoading = true;
    },
    // 监听可以播放事件（缓冲足够）
    onCanPlay() {
      this.audioLoading = false;
    },
    copyToClipboard(text) {
      navigator.clipboard.writeText(text).catch(err => {
        console.error('复制失败:', err);
      });
    },
    handleContactClick(item) {
      this.copyToClipboard(item.value);
    },
    openContactLink(item) {
      if (item.type === 'qq') {
        window.open(`tencent://message/?uin=${item.value}&Site=&Menu=yes`, '_blank');
      } else if (item.type === 'group') {
        window.open(`mqqapi://card/show_pslcard?src_type=internal&version=1&uin=${item.value}&card_type=group&source=qrcode`, '_blank');
      } else if (item.type === 'email') {
        window.open(`mailto:${item.value}`, '_blank');
      } else if (item.type === 'wechat') {
        window.open(`weixin://dl/chat?${item.value}`, '_blank');
      } else if (item.type === 'github') {
        window.open(`https://github.com/${item.value}`, '_blank');
      } else {
        this.copyToClipboard(item.value);
      }
    },
    openContactDialog(tab = 'email') {
      this.contactTab = tab;
      this.dialog3 = true;
    },
    getContactsByTab(tab) {
      if (!this.contactInfo || !this.contactInfo.groups) return { items: [], description: '' };
      
      const groupMap = {
        'qq': 'QQ相关',
        'email': '邮箱相关',
        'wechat': '微信'
      };
      
      const groupName = groupMap[tab];
      const group = this.contactInfo.groups.find(g => g.name === groupName);
      
      return group ? { items: group.items, description: group.description } : { items: [], description: '' };
    },
  }
};