const config = {
	//网页元数据
	metaData: {
		title: 'Trent的个人主页🎉',
		description: '欢迎来到Trent的奇妙世界！',
		keywords: 'Trent,Trent,个人主页,个人网站',
		icon: '/img/tx4.png?v=3'   //网页图标，支持外链
	},

	// avatar: "/img/avatar.jpg", // 头像
	avatar: "/img/tx4.png", // 头像
	welcometitle: "Hi, I'm Trent", // 标题

	// 颜色配置
	color: {
		themecolor: "#FFFFFF", // 主题颜色，推荐趋于亮白可带有轻微色调，例： #D1FFEC
		welcometitlecolor: "#FFFFFF", // 标题颜色 例： #7BFFC9
		turntablecolor1: "#FFFF00",  // 转盘渐变色一
		turntablecolor2: "#00FFFF"   // 转盘渐变色二
	},

	brightness: 80, // 背景亮度 --%
	blur: 12, // 毛玻璃模糊效果

	// 我的标签
	tags: ['间歇性奋斗', '拖延症末期',  '赖床冠军', '深夜网抑云',  '烧水劝退师', '选择困难症', '退堂鼓艺术家'],

	// 默认背景壁纸
	background: {
		"pc": {   //pc端
			"type": "pic",   //"pic":静态壁纸;"video":动态壁纸
			"datainfo": {
				"title": "边缘行者",
				"preview": "/img/new-wallpaper/static/边缘行者/image-pre.webp",
				"url": "/img/new-wallpaper/static/边缘行者/image.png",     //当然，也可填写网络地址或壁纸api，如随机PC壁纸api："url":"https://t.mwm.moe/pc"
			},
		},
		"mobile": {   //移动端
			"type": "pic",
			"datainfo": {
				"title": "0002",
				"preview": "/img/new-wallpaper/static-mobile/0002/image-pre.webp",
				"url": "/img/new-wallpaper/static-mobile/0002/image.png"  //同理，随机移动端壁纸："url":"https://t.mwm.moe/mp"
			}
		}

	},

	//极坐标图数据
	polarChart: {
		skills: ['子时 00:00-02:00', '丑时 02:00-04:00', '寅时 04:00-06:00', '卯时 06:00-08:00', '辰时 08:00-10:00', '巳时 10:00-12:00', '午时 12:00-14:00', '未时 14:00-16:00', '申时 16:00-18:00', '酉时 18:00-20:00', '戌时 20:00-22:00', '亥时 22:00-00:00'],
		skillPoints: [90, 70, 20, 60, 20, 50, 80, 40, 50, 60, 70, 80],
	},

	//社交按钮
	socialPlatformIcons: [
		// { icon: "mdi-github", link: "https://www.github.com/leleo886" },
		{ icon: "mdi-email", link: "mailto:a2832893528@qq.com" },
		{ icon: "mdi-qqchat", link: "https://qm.qq.com/q/AraDkhWLIs" },
		{ icon: "mdi-wechat", link: "weixin://dl/chat?huangleihhh" },
		// { icon: "mdi-youtube", link: "https://www.youtube.com" },
		// { icon: "mdi-facebook", link: "https://www.facebook.com" }
	],

	//打字机
	typeWriterStrings: [
		"如果你看到了这行字，说明我们也许会有一场很有意思的相遇。",
		"比起匆忙赶路，我更愿意认真生活，慢慢靠近自己想要的远方。",
		"心简单，世界就简单，幸福才会生长；心自由，生活就自由，到哪都有快乐。",
		"生命太短，没有时间留给遗憾，若不是终点，请微笑一直向前。"
	],

	//音乐播放配置，采用MetingJS Api(https://github.com/metowolf/MetingJS)
	musicPlayer: {
		server: 'tencent',  //服务提供商 --QQ音乐
		type: 'playlist',   //歌单类型
		id: '9677936501'  //歌单id ---> https://i.y.qq.com/n2/m/share/details/taoge.html?id=9677936501
	},

	//壁纸数据 -----可以将壁纸文件上传到图床获取网络直链。若想调用api，请前往脚本自行修改逻辑
	wallpaper: {
		pic: [
			{ "title": "边缘行者", "preview": "/img/new-wallpaper/static/边缘行者/image-pre.webp", "url": "/img/new-wallpaper/static/边缘行者/image.png" },
			{ "title": "边缘行者2", "preview": "/img/new-wallpaper/static/边缘行者2/image-pre.webp", "url": "/img/new-wallpaper/static/边缘行者2/image.png" },
			{ "title": "天气之子", "preview": "/img/new-wallpaper/static/天气之子/image-pre.webp", "url": "/img/new-wallpaper/static/天气之子/image.png" },
			{ "title": "男孩和不知名动物", "preview": "/img/new-wallpaper/static/男孩和不知名动物/image-pre.webp", "url": "/img/new-wallpaper/static/男孩和不知名动物/image.png" },
			{ "title": "达令", "preview": "/img/new-wallpaper/static/达令/image-pre.webp", "url": "/img/new-wallpaper/static/达令/image.png" },
			{ "title": "达令2", "preview": "/img/new-wallpaper/static/达令2/image-pre.webp", "url": "/img/new-wallpaper/static/达令2/image.png" },
			{ "title": "雷古", "preview": "/img/new-wallpaper/static/雷古/image-pre.webp", "url": "/img/new-wallpaper/static/雷古/image.png" },
			{ "title": "传说之下小花", "preview": "/img/new-wallpaper/static/传说之下小花/image-pre.webp", "url": "/img/new-wallpaper/static/传说之下小花/image.png" },
			{ "title": "水手男孩", "preview": "/img/new-wallpaper/static/水手男孩/image-pre.webp", "url": "/img/new-wallpaper/static/水手男孩/image.png" },
		],
		picMobile: [
			{ "title": "0001", "preview": "/img/new-wallpaper/static-mobile/0001/image-pre.webp", "url": "/img/new-wallpaper/static-mobile/0001/image.png" },
			{ "title": "0002", "preview": "/img/new-wallpaper/static-mobile/0002/image-pre.webp", "url": "/img/new-wallpaper/static-mobile/0002/image.png" },
			{ "title": "0003", "preview": "/img/new-wallpaper/static-mobile/0003/image-pre.webp", "url": "/img/new-wallpaper/static-mobile/0003/image.png" },
			{ "title": "0004", "preview": "/img/new-wallpaper/static-mobile/0004/image-pre.webp", "url": "/img/new-wallpaper/static-mobile/0004/image.png" },
			{ "title": "0005", "preview": "/img/new-wallpaper/static-mobile/0005/image-pre.webp", "url": "/img/new-wallpaper/static-mobile/0005/image.png" },
			{ "title": "0006", "preview": "/img/new-wallpaper/static-mobile/0006/image-pre.webp", "url": "/img/new-wallpaper/static-mobile/0006/image.png" },
			{ "title": "0007", "preview": "/img/new-wallpaper/static-mobile/0007/image-pre.webp", "url": "/img/new-wallpaper/static-mobile/0007/image.png" },
			{ "title": "0008", "preview": "/img/new-wallpaper/static-mobile/0008/image-pre.webp", "url": "/img/new-wallpaper/static-mobile/0008/image.png" },
			{ "title": "0009", "preview": "/img/new-wallpaper/static-mobile/0009/image-pre.webp", "url": "/img/new-wallpaper/static-mobile/0009/image.png" },
			{ "title": "0010", "preview": "/img/new-wallpaper/static-mobile/0010/image-pre.webp", "url": "/img/new-wallpaper/static-mobile/0010/image.png" },
			{ "title": "0011", "preview": "/img/new-wallpaper/static-mobile/0011/image-pre.webp", "url": "/img/new-wallpaper/static-mobile/0011/image.png" },
			{ "title": "0012", "preview": "/img/new-wallpaper/static-mobile/0012/image-pre.webp", "url": "/img/new-wallpaper/static-mobile/0012/image.png" },
			{ "title": "0013", "preview": "/img/new-wallpaper/static-mobile/0013/image-pre.webp", "url": "/img/new-wallpaper/static-mobile/0013/image.png" },
			{ "title": "0014", "preview": "/img/new-wallpaper/static-mobile/0014/image-pre.webp", "url": "/img/new-wallpaper/static-mobile/0014/image.png" },
			{ "title": "0015", "preview": "/img/new-wallpaper/static-mobile/0015/image-pre.webp", "url": "/img/new-wallpaper/static-mobile/0015/image.png" },
			{ "title": "0016", "preview": "/img/new-wallpaper/static-mobile/0016/image-pre.webp", "url": "/img/new-wallpaper/static-mobile/0016/image.png" },
			{ "title": "0017", "preview": "/img/new-wallpaper/static-mobile/0017/image-pre.webp", "url": "/img/new-wallpaper/static-mobile/0017/image.png" },
			{ "title": "0018", "preview": "/img/new-wallpaper/static-mobile/0018/image-pre.webp", "url": "/img/new-wallpaper/static-mobile/0018/image.png" },
			{ "title": "0019", "preview": "/img/new-wallpaper/static-mobile/0019/image-pre.webp", "url": "/img/new-wallpaper/static-mobile/0019/image.png" },
			{ "title": "0020", "preview": "/img/new-wallpaper/static-mobile/0020/image-pre.webp", "url": "/img/new-wallpaper/static-mobile/0020/image.png" },
			{ "title": "0021", "preview": "/img/new-wallpaper/static-mobile/0021/image-pre.webp", "url": "/img/new-wallpaper/static-mobile/0021/image.png" },
			{ "title": "0022", "preview": "/img/new-wallpaper/static-mobile/0022/image-pre.webp", "url": "/img/new-wallpaper/static-mobile/0022/image.png" },
		],
		video: [
			{
				"title": "尼尔：机械纪元 团队",
				"preview": "/img/wallpaper/dynamic/尼尔：机械纪元 团队/Nier-Automata-Team-pre.webm",
				"url": "/img/wallpaper/dynamic/尼尔：机械纪元 团队/Nier-Automata-Team.webm"
			},
			{
				"title": "向往航天的女孩",
				"preview": "/img/wallpaper/dynamic/向往航天的女孩/Toy-Aeroplane-pre.webm",
				"url": "/img/wallpaper/dynamic/向往航天的女孩/Toy-Aeroplane.webm"
			},
			{
				"title": "世界很温柔《龙族》上杉绘梨衣",
				"preview": "https://www.leleo.top/img/wallpaper/dynamic/%E4%B8%96%E7%95%8C%E5%BE%88%E6%B8%A9%E6%9F%94%E3%80%8A%E9%BE%99%E6%97%8F%E3%80%8B%E4%B8%8A%E6%9D%89%E7%BB%98%E6%A2%A8%E8%A1%A3/A2EF5E85-pre.webm",
				"url": "https://www.leleo.top/img/wallpaper/dynamic/%E4%B8%96%E7%95%8C%E5%BE%88%E6%B8%A9%E6%9F%94%E3%80%8A%E9%BE%99%E6%97%8F%E3%80%8B%E4%B8%8A%E6%9D%89%E7%BB%98%E6%A2%A8%E8%A1%A3/A2EF5E85.webm"
			},
		],
		videoMobile: [
			{
				"title": "幻觉镇-gaako_illust",
				"preview": "/img/wallpaper/dynamic-mobile/幻觉镇-gaako_illust/Hallucination_town-pre.mp4",
				"url": "/img/wallpaper/dynamic-mobile/幻觉镇-gaako_illust/Hallucination_town.mp4"
			},
			{
				"title": "chuva",
				"preview": "/img/wallpaper/dynamic-mobile/chuva/chuva-pre.mp4",
				"url": "/img/wallpaper/dynamic-mobile/chuva/chuva.mp4"
			},
			{
				"title": "Doodle-小猫女仆降临",
				"preview": "/img/wallpaper/dynamic-mobile/Doodle-小猫女仆降临/d12-pre.mp4",
				"url": "/img/wallpaper/dynamic-mobile/Doodle-小猫女仆降临/d12.mp4"
			},
		],
	},

	//项目卡片 其中 字段"show"控制初始卡片的text是否展开
	projectcards: [
		{ go: "🗂️ 前往", img: "/img/General Wallpaper/compressed_images/1407685.png", title: "Trent Shop", subtitle: "个人小店", text: "售卖自用软件、脚本与折腾成果", url: "https://shop.trent30.org/", show: false },
		{ go: "📝 前往", img: "/img/General Wallpaper/compressed_images/320687.jpg", title: "Airport", subtitle: "网络优化方案", text: "跨越数字边界的全天候网络接入点", url: "https://vpn.trent30.com/", show: false },
		{ go: "📡 前往", img: "/img/General Wallpaper/compressed_images/337420.jpg", title: "Probe", subtitle: "服务器状态监控", text: "实时查看服务器在线状态、负载与资源占用", url: "https://nz.trent30.com/", show: false },
		{ go: "🔌 前往", img: "/img/General Wallpaper/compressed_images/1407656.jpg", title: "New API", subtitle: "API 聚合服务", text: "统一管理与转发多模型 API，方便接入不同 AI 服务", url: "https://newapi.trent30.com/", show: false },
		{ go: "🎧 前往", img: "/img/General Wallpaper/compressed_images/35957.jpg", title: "Anime Music World", subtitle: "首次网站设计", text: "22年大学时期首个独立完成的网站设计，围绕动漫音乐世界搭建的早期作品，留作纪念", url: "https://anime-music-world.trent30.com/", show: false },
		{ go: "🚀 前往", img: "/img/General Wallpaper/compressed_images/813527.jpg", title: "NextChat", subtitle: "AI 对话项目", text: "一个开源的 AI 聊天客户端，支持多模型、Markdown、插件与多端部署", url: "https://nextchat.thirty30.top/", show: false },
		{ go: "🎨 前往", img: "/img/General Wallpaper/compressed_images/906482.jpg", title: "GPT Image", subtitle: "AI 图片生成", text: "基于 AI 的图片生成工具，快速创建创意视觉内容", url: "https://gpt-image.trent30.com/", show: false },
		{ go: "✉️ 前往", img: "/img/General Wallpaper/compressed_images/1346366.png", title: "FreeMail", subtitle: "临时邮箱服务", text: "便捷获取临时邮箱，用于注册验证与邮件接收", url: "https://freemail.trent30.org/", show: false },
		{ go: "🔍 前往", img: "/img/sunshine.jpg", title: "Project 9", subtitle: "9,000 miles of wonder", text: "If you see this line, I've managed to get your attention.", url: "https://thirty30.top/", show: false },
		{ go: "🔍 前往", img: "/img/sunshine.jpg", title: "Project 10", subtitle: "10,000 miles of wonder", text: "If you see this line, I've managed to get your attention.", url: "https://thirty30.top/", show: false },
		{ go: "🔍 前往", img: "/img/sunshine.jpg", title: "Project 11", subtitle: "11,000 miles of wonder", text: "If you see this line, I've managed to get your attention.", url: "https://thirty30.top/", show: false },
		{ go: "🔍 前往", img: "/img/sunshine.jpg", title: "Project 12", subtitle: "12,000 miles of wonder", text: "If you see this line, I've managed to get your attention.", url: "https://thirty30.top/", show: false },
	],

	statement: [],
}

export default config