(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,132655,831818,612160,e=>{"use strict";let t,i;var a=e.i(339954),r=e.i(650471).default,n={VIDEO:"video",THUMBNAIL:"thumbnail",STORYBOARD:"storyboard",DRM:"drm"},s={NOT_AN_ERROR:0,NETWORK_OFFLINE:2000002,NETWORK_UNKNOWN_ERROR:2e6,NETWORK_NO_STATUS:2000001,NETWORK_INVALID_URL:24e5,NETWORK_NOT_FOUND:2404e3,NETWORK_NOT_READY:2412e3,NETWORK_GENERIC_SERVER_FAIL:25e5,NETWORK_TOKEN_MISSING:2403201,NETWORK_TOKEN_MALFORMED:2412202,NETWORK_TOKEN_EXPIRED:2403210,NETWORK_TOKEN_AUD_MISSING:2403221,NETWORK_TOKEN_AUD_MISMATCH:2403222,NETWORK_TOKEN_SUB_MISMATCH:2403232,ENCRYPTED_ERROR:5e6,ENCRYPTED_UNSUPPORTED_KEY_SYSTEM:5000001,ENCRYPTED_GENERATE_REQUEST_FAILED:5000002,ENCRYPTED_UPDATE_LICENSE_FAILED:5000003,ENCRYPTED_UPDATE_SERVER_CERT_FAILED:5000004,ENCRYPTED_CDM_ERROR:5000005,ENCRYPTED_OUTPUT_RESTRICTED:5000006,ENCRYPTED_MISSING_TOKEN:5000002},o=e=>e===n.VIDEO?"playback":e,l=class e extends Error{constructor(t,i=e.MEDIA_ERR_CUSTOM,a,r){var n;super(t),this.name="MediaError",this.code=i,this.context=r,this.fatal=null!=a?a:i>=e.MEDIA_ERR_NETWORK&&i<=e.MEDIA_ERR_ENCRYPTED,this.message||(this.message=null!=(n=e.defaultMessages[this.code])?n:"")}};l.MEDIA_ERR_ABORTED=1,l.MEDIA_ERR_NETWORK=2,l.MEDIA_ERR_DECODE=3,l.MEDIA_ERR_SRC_NOT_SUPPORTED=4,l.MEDIA_ERR_ENCRYPTED=5,l.MEDIA_ERR_CUSTOM=100,l.defaultMessages={1:"You aborted the media playback",2:"A network error caused the media download to fail.",3:"A media error caused playback to be aborted. The media could be corrupt or your browser does not support this format.",4:"An unsupported error occurred. The server or network failed, or your browser does not support this format.",5:"The media is encrypted and there are no keys to decrypt it."};var d=(e,t)=>null!=t&&e in t,u={ANY:"any",MUTED:"muted"},m={ON_DEMAND:"on-demand",LIVE:"live",UNKNOWN:"unknown"},h={MSE:"mse",NATIVE:"native"},c={HEADER:"header",QUERY:"query",NONE:"none"},p=Object.values(c),v={M3U8:"application/vnd.apple.mpegurl",MP4:"video/mp4"},b={HLS:v.M3U8},E=(Object.keys(b),[...Object.values(v)],{upTo720p:"720p",upTo1080p:"1080p",upTo1440p:"1440p",upTo2160p:"2160p"}),g={noLessThan480p:"480p",noLessThan540p:"540p",noLessThan720p:"720p",noLessThan1080p:"1080p",noLessThan1440p:"1440p",noLessThan2160p:"2160p"},f={DESCENDING:"desc"},A={code:"en"},y=(e,t,i,a,r=e)=>{r.addEventListener(t,i,a),e.addEventListener("teardown",()=>{r.removeEventListener(t,i)},{once:!0})},T=e=>{let t=e.indexOf("?");return t<0?[e]:[e.slice(0,t),e.slice(t)]},k=e=>{let{type:t}=e;if(t){let e=t.toUpperCase();return d(e,b)?b[e]:t}return I(e)},_=e=>"VOD"===e?m.ON_DEMAND:m.LIVE,w=e=>"EVENT"===e?1/0:"VOD"===e?NaN:0,I=e=>{let{src:t}=e;if(!t)return"";let i="";try{i=new URL(t).pathname}catch{console.error("invalid url")}let a=i.lastIndexOf(".");if(a<0)return C(e)?v.M3U8:"";let r=i.slice(a+1).toUpperCase();return d(r,v)?v[r]:""},R="mux.com",C=({src:e,customDomain:t=R})=>{let i;try{i=new URL(`${e}`)}catch{return!1}let a="https:"===i.protocol,r=i.hostname===`stream.${t}`.toLowerCase(),n=i.pathname.split("/"),s=2===n.length,o=!(null!=n&&n[1].includes("."));return a&&r&&s&&o},S=e=>{let t=(null!=e?e:"").split(".")[1];if(t)try{let e=t.replace(/-/g,"+").replace(/_/g,"/"),i=decodeURIComponent(atob(e).split("").map(function(e){return"%"+("00"+e.charCodeAt(0).toString(16)).slice(-2)}).join(""));return JSON.parse(i)}catch{return}};function M(e,t=!0){var i;return new L(t&&null!=(i=null==A?void 0:A[e])?i:e,t?A.code:"en")}var L=class{constructor(e,t=(e=>null!=(e=A)?e:"en")()){this.message=e,this.locale=t}format(e){return this.message.replace(/\{(\w+)\}/g,(t,i)=>{var a;return null!=(a=e[i])?a:""})}toString(){return this.message}},D=Object.values(u),x=e=>"boolean"==typeof e||"string"==typeof e&&D.includes(e),N=(e,t)=>{if(!t)return;let i=e.muted,a=()=>e.muted=i;switch(t){case u.ANY:e.play().catch(()=>{e.muted=!0,e.play().catch(a)});break;case u.MUTED:e.muted=!0,e.play().catch(a);break;default:e.play().catch(()=>{})}},O=e=>"time"in e?e.time:e.startTime;function P(e,t,i,a,r,n){let s=document.createElement("track");return s.kind=t,s.label=i,a&&(s.srclang=a),r&&(s.id=r),n&&(s.default=!0),s.track.mode=["subtitles","captions"].includes(t)?"disabled":"hidden",s.setAttribute("data-removeondestroy",""),e.append(s),s.track}function U(e,t){let i=Array.prototype.find.call(e.querySelectorAll("track"),e=>e.track===t);null==i||i.remove()}function W(e,t,i){var a;return null==(a=Array.from(e.querySelectorAll("track")).find(e=>e.track.label===t&&e.track.kind===i))?void 0:a.track}async function $(e,t,i,a){let r=W(e,i,a);return r||((r=P(e,a,i)).mode="hidden",await new Promise(e=>setTimeout(()=>e(void 0),0))),"hidden"!==r.mode&&(r.mode="hidden"),[...t].sort((e,t)=>O(t)-O(e)).forEach(t=>{var i,n;let s=t.value,o=O(t);if("endTime"in t&&null!=t.endTime)null==r||r.addCue(new VTTCue(o,t.endTime,"chapters"===a?s:JSON.stringify(null!=s?s:null)));else{let t=Array.prototype.findIndex.call(null==r?void 0:r.cues,e=>e.startTime>=o),l=null==(i=null==r?void 0:r.cues)?void 0:i[t],d=l?l.startTime:Number.isFinite(e.duration)?e.duration:Number.MAX_SAFE_INTEGER,u=null==(n=null==r?void 0:r.cues)?void 0:n[t-1];u&&(u.endTime=o),null==r||r.addCue(new VTTCue(o,d,"chapters"===a?s:JSON.stringify(null!=s?s:null)))}}),e.textTracks.dispatchEvent(new Event("change",{bubbles:!0,composed:!0})),r}var B="cuepoints",H=Object.freeze({label:B});async function V(e,t,i=H){return $(e,t,i.label,"metadata")}var K=e=>({time:e.startTime,value:JSON.parse(e.text)});function F(e,t={label:B}){let i=W(e,t.label,"metadata");return null!=i&&i.cues?Array.from(i.cues,e=>K(e)):[]}function Y(e,t={label:B}){var i,a;let r=W(e,t.label,"metadata");if(!(null!=(i=null==r?void 0:r.activeCues)&&i.length))return;if(1===r.activeCues.length)return K(r.activeCues[0]);let{currentTime:n}=e;return K(Array.prototype.find.call(null!=(a=r.activeCues)?a:[],({startTime:e,endTime:t})=>e<=n&&t>n)||r.activeCues[0])}async function G(e,t=H){return new Promise(i=>{y(e,"loadstart",async()=>{let a=await V(e,[],t);y(e,"cuechange",()=>{let t=Y(e);if(t){let i=new CustomEvent("cuepointchange",{composed:!0,bubbles:!0,detail:t});e.dispatchEvent(i)}},{},a),i(a)})})}var q="chapters",j=Object.freeze({label:q}),Z=e=>({startTime:e.startTime,endTime:e.endTime,value:e.text});async function Q(e,t,i=j){return $(e,t,i.label,"chapters")}function z(e,t={label:q}){var i;let a=W(e,t.label,"chapters");return null!=(i=null==a?void 0:a.cues)&&i.length?Array.from(a.cues,e=>Z(e)):[]}function X(e,t={label:q}){var i,a;let r=W(e,t.label,"chapters");if(!(null!=(i=null==r?void 0:r.activeCues)&&i.length))return;if(1===r.activeCues.length)return Z(r.activeCues[0]);let{currentTime:n}=e;return Z(Array.prototype.find.call(null!=(a=r.activeCues)?a:[],({startTime:e,endTime:t})=>e<=n&&t>n)||r.activeCues[0])}async function J(e,t=j){return new Promise(i=>{y(e,"loadstart",async()=>{let a=await Q(e,[],t);y(e,"cuechange",()=>{let t=X(e);if(t){let i=new CustomEvent("chapterchange",{composed:!0,bubbles:!0,detail:t});e.dispatchEvent(i)}},{},a),i(a)})})}function ee(e,t){if(t){let i=t.playingDate;if(null!=i)return new Date(i.getTime()-1e3*e.currentTime)}return"function"==typeof e.getStartDate?e.getStartDate():new Date(NaN)}function et(e,t){return t&&t.playingDate?t.playingDate:new Date("function"==typeof e.getStartDate?e.getStartDate().getTime()+1e3*e.currentTime:NaN)}var ei={VIDEO:"v",THUMBNAIL:"t",STORYBOARD:"s",DRM:"d"},ea=(e,t,i,a,r=!1,u=!(e=>null==(e=globalThis.navigator)?void 0:e.onLine)())=>{var h,c,p,v;let b,E;if(u){let i=M("Your device appears to be offline",r),a=l.MEDIA_ERR_NETWORK,n=new l(i,a,!1,void 0);return n.errorCategory=t,n.muxCode=s.NETWORK_OFFLINE,n.data=e,n}let g="status"in e?e.status:e.code,f=Date.now(),A=l.MEDIA_ERR_NETWORK;if(200===g)return;let y=o(t),k=(b=o(t),E=`${b}Token`,null!=(p=i.tokens)&&p[b]?null==(v=i.tokens)?void 0:v[b]:d(E,i)?i[E]:void 0),_=t===n.VIDEO?ei.VIDEO:t===n.DRM?ei.DRM:void 0,[w]=T(null!=(h=i.playbackId)?h:"");if(!g||!w)return;let I=S(k);if(k&&!I){let i=new l(M("The {tokenNamePrefix}-token provided is invalid or malformed.",r).format({tokenNamePrefix:y}),A,!0,M("Compact JWT string: {token}",r).format({token:k}));return i.errorCategory=t,i.muxCode=s.NETWORK_TOKEN_MALFORMED,i.data=e,i}if(g>=500){let e=new l("",A,null==a||a);return e.errorCategory=t,e.muxCode=s.NETWORK_UNKNOWN_ERROR,e}if(403===g)if(I){if((({exp:e},t=Date.now())=>!e||1e3*e<t)(I,f)){let i={timeStyle:"medium",dateStyle:"medium"},a=new l(M("The video’s secured {tokenNamePrefix}-token has expired.",r).format({tokenNamePrefix:y}),A,!0,M("Expired at: {expiredDate}. Current time: {currentDate}.",r).format({expiredDate:new Intl.DateTimeFormat("en",i).format(null!=(c=I.exp)?c:0),currentDate:new Intl.DateTimeFormat("en",i).format(f)}));return a.errorCategory=t,a.muxCode=s.NETWORK_TOKEN_EXPIRED,a.data=e,a}if((({sub:e},t)=>e!==t)(I,w)){let i=new l(M("The video’s playback ID does not match the one encoded in the {tokenNamePrefix}-token.",r).format({tokenNamePrefix:y}),A,!0,M("Specified playback ID: {playbackId} and the playback ID encoded in the {tokenNamePrefix}-token: {tokenPlaybackId}",r).format({tokenNamePrefix:y,playbackId:w,tokenPlaybackId:I.sub}));return i.errorCategory=t,i.muxCode=s.NETWORK_TOKEN_SUB_MISMATCH,i.data=e,i}if((({aud:e},t)=>!e)(I,0)){let i=new l(M("The {tokenNamePrefix}-token is formatted with incorrect information.",r).format({tokenNamePrefix:y}),A,!0,M("The {tokenNamePrefix}-token has no aud value. aud value should be {expectedAud}.",r).format({tokenNamePrefix:y,expectedAud:_}));return i.errorCategory=t,i.muxCode=s.NETWORK_TOKEN_AUD_MISSING,i.data=e,i}if((({aud:e},t)=>e!==t)(I,_)){let i=new l(M("The {tokenNamePrefix}-token is formatted with incorrect information.",r).format({tokenNamePrefix:y}),A,!0,M("The {tokenNamePrefix}-token has an incorrect aud value: {aud}. aud value should be {expectedAud}.",r).format({tokenNamePrefix:y,expectedAud:_,aud:I.aud}));return i.errorCategory=t,i.muxCode=s.NETWORK_TOKEN_AUD_MISMATCH,i.data=e,i}}else{let i=new l(M("Authorization error trying to access this {category} URL. If this is a signed URL, you might need to provide a {tokenNamePrefix}-token.",r).format({tokenNamePrefix:y,category:t}),A,null==a||a,M("Specified playback ID: {playbackId}",r).format({playbackId:w}));return i.errorCategory=t,i.muxCode=s.NETWORK_TOKEN_MISSING,i.data=e,i}if(412===g){let n=new l(M("This playback-id may belong to a live stream that is not currently active or an asset that is not ready.",r),A,null==a||a,M("Specified playback ID: {playbackId}",r).format({playbackId:w}));return n.errorCategory=t,n.muxCode=s.NETWORK_NOT_READY,n.streamType=i.streamType===m.LIVE?"live":i.streamType===m.ON_DEMAND?"on-demand":"unknown",n.data=e,n}if(404===g){let i=new l(M("This URL or playback-id does not exist. You may have used an Asset ID or an ID from a different resource.",r),A,null==a||a,M("Specified playback ID: {playbackId}",r).format({playbackId:w}));return i.errorCategory=t,i.muxCode=s.NETWORK_NOT_FOUND,i.data=e,i}if(400===g){let i=new l(M("The URL or playback-id was invalid. You may have used an invalid value as a playback-id."),A,null==a||a,M("Specified playback ID: {playbackId}",r).format({playbackId:w}));return i.errorCategory=t,i.muxCode=s.NETWORK_INVALID_URL,i.data=e,i}let R=new l("",A,null==a||a);return R.errorCategory=t,R.muxCode=s.NETWORK_UNKNOWN_ERROR,R.data=e,R},er=r.DefaultConfig.capLevelController,en={"720p":921600,"1080p":2073600,"1440p":4194304,"2160p":8294400},es=class e extends er{constructor(e){super(e)}static setMaxAutoResolution(t,i){i?e.maxAutoResolution.set(t,i):e.maxAutoResolution.delete(t)}getMaxAutoResolution(){var t;let i=this.hls;return null!=(t=e.maxAutoResolution.get(i))?t:void 0}get levels(){var e;return null!=(e=this.hls.levels)?e:[]}getValidLevels(e){return this.levels.filter((t,i)=>this.isLevelAllowed(t)&&i<=e)}getMaxLevelCapped(e){let t=this.getValidLevels(e),i=this.getMaxAutoResolution();if(!i)return super.getMaxLevel(e);let a=en[i.toLowerCase().trim()];if(!a)return super.getMaxLevel(e);let r=t.filter(e=>e.width*e.height<=a),n=r.findIndex(e=>e.width*e.height===a);if(-1!==n){let e=r[n];return t.findIndex(t=>t===e)}if(0===r.length)return 0;let s=r[r.length-1];return t.findIndex(e=>e===s)}getMaxLevel(t){if(void 0!==this.getMaxAutoResolution())return this.getMaxLevelCapped(t);let i=super.getMaxLevel(t),a=this.getValidLevels(t);if(!a[i])return i;let r=Math.min(a[i].width,a[i].height),n=e.minMaxResolution;return r>=n?i:er.getMaxLevelByMediaSize(a,16/9*n,n)}};es.minMaxResolution=720,es.maxAutoResolution=new WeakMap;var eo,el,ed,eu,em,eh,ec="fairplay",ep=/([A-Z0-9-]+)="?(.*?)"?(?:,|$)/g,ev=async(e,t)=>{if(t===v.MP4)return{streamType:m.ON_DEMAND,targetLiveWindow:NaN,liveEdgeStartOffset:void 0,sessionData:void 0};if(t===v.M3U8){let t=await fetch(e);if(!t.ok)return Promise.reject(t);let i=await t.text(),a=await fetch(i.split(`
`).find((e,t,i)=>t&&i[t-1].startsWith("#EXT-X-STREAM-INF"))).then(e=>200!==e.status?Promise.reject(e):e.text());return{...(e=>{let t=e.split(`
`).filter(e=>e.startsWith("#EXT-X-SESSION-DATA"));if(!t.length)return{};let i={};for(let e of t){let t=Object.fromEntries([...e.matchAll(ep)].map(([,e,t])=>[e,t])),a=t["DATA-ID"];a&&(i[a]={...t})}return{sessionData:i}})(i),...(e=>{var t,i,a;let r=e.split(`
`),n=null==(i=(null!=(t=r.find(e=>e.startsWith("#EXT-X-PLAYLIST-TYPE")))?t:"").split(":")[1])?void 0:i.trim(),s=_(n),o=w(n),l;if(s===m.LIVE){let e=r.find(e=>e.startsWith("#EXT-X-PART-INF"));if(e)l=2*e.split(":")[1].split("=")[1];else{let e=r.find(e=>e.startsWith("#EXT-X-TARGETDURATION")),t=null==(a=null==e?void 0:e.split(":"))?void 0:a[1];l=(null!=t?t:6)*3}}return{streamType:s,targetLiveWindow:o,liveEdgeStartOffset:l}})(a)}}return console.error(`Media type ${t} is an unrecognized or unsupported type for src ${e}.`),{streamType:void 0,targetLiveWindow:void 0,liveEdgeStartOffset:void 0,sessionData:void 0}},eb=async(e,t,i=k({src:e}))=>{var a,r,n,s;let{streamType:o,targetLiveWindow:l,liveEdgeStartOffset:d,sessionData:u}=await ev(e,i),m=null==u?void 0:u["com.apple.hls.chapters"];(null!=m&&m.URI||null!=m&&m.VALUE.toLocaleLowerCase().startsWith("http"))&&eE(null!=(a=m.URI)?a:m.VALUE,t),(null!=(r=ey.get(t))?r:{}).liveEdgeStartOffset=d,(null!=(n=ey.get(t))?n:{}).targetLiveWindow=l,t.dispatchEvent(new CustomEvent("targetlivewindowchange",{composed:!0,bubbles:!0})),(null!=(s=ey.get(t))?s:{}).streamType=o,t.dispatchEvent(new CustomEvent("streamtypechange",{composed:!0,bubbles:!0}))},eE=async(e,t)=>{var i,a;try{let r=await fetch(e);if(!r.ok)throw Error(`Failed to fetch Mux metadata: ${r.status} ${r.statusText}`);let n=await r.json(),s={};if(!(null!=(i=null==n?void 0:n[0])&&i.metadata))return;for(let e of n[0].metadata)e.key&&e.value&&(s[e.key]=e.value);(null!=(a=ey.get(t))?a:{}).metadata=s;let o=new CustomEvent("muxmetadata");t.dispatchEvent(o)}catch(e){console.error(e)}},eg=null!=(el=null==(eo=null==globalThis?void 0:globalThis.navigator)?void 0:eo.userAgent)?el:"",ef=null!=(em=null==(eu=null==(ed=null==globalThis?void 0:globalThis.navigator)?void 0:ed.userAgentData)?void 0:eu.platform)?em:"",eA=eg.toLowerCase().includes("android")||["x11","android"].some(e=>ef.toLowerCase().includes(e)),ey=new WeakMap,eT="mux.com",ek=null==(eh=r.isSupported)?void 0:eh.call(r),e_=()=>{if("u">typeof window)return a.default.utils.now()},ew=a.default.utils.generateUUID,eI=({playbackId:e,customDomain:t=eT,maxResolution:i,minResolution:a,renditionOrder:r,programStartTime:n,programEndTime:s,assetStartTime:o,assetEndTime:l,playbackToken:d,tokens:{playback:u=d}={},extraSourceParams:m={}}={})=>{if(!e)return;let[h,c=""]=T(e),p=new URL(`https://stream.${t}/${h}.m3u8${c}`);return u||p.searchParams.has("token")?(p.searchParams.forEach((e,t)=>{"token"!=t&&p.searchParams.delete(t)}),u&&p.searchParams.set("token",u)):(i&&p.searchParams.set("max_resolution",i),a&&(p.searchParams.set("min_resolution",a),i&&+i.slice(0,-1)<+a.slice(0,-1)&&console.error("minResolution must be <= maxResolution","minResolution",a,"maxResolution",i)),r&&p.searchParams.set("rendition_order",r),n&&p.searchParams.set("program_start_time",`${n}`),s&&p.searchParams.set("program_end_time",`${s}`),o&&p.searchParams.set("asset_start_time",`${o}`),l&&p.searchParams.set("asset_end_time",`${l}`),Object.entries(m).forEach(([e,t])=>{null!=t&&p.searchParams.set(e,t)})),p.toString()},eR=e=>{if(!e)return;let[t]=e.split("?");return t||void 0},eC=e=>{if(!e||!e.startsWith("https://stream."))return;let[t]=new URL(e).pathname.slice(1).split(/\.m3u8|\//);return t||void 0},eS=e=>{var t;return null==(t=ey.get(e))?void 0:t.error},eM=e=>{var t;return null==(t=ey.get(e))?void 0:t.metadata},eL=e=>{var t,i;return null!=(i=null==(t=ey.get(e))?void 0:t.streamType)?i:m.UNKNOWN},eD=e=>{var t,i;return null!=(i=null==(t=ey.get(e))?void 0:t.targetLiveWindow)?i:NaN},ex=e=>{var t,i;return null!=(i=null==(t=ey.get(e))?void 0:t.seekable)?i:e.seekable},eN=e=>{var t;let i=null==(t=ey.get(e))?void 0:t.liveEdgeStartOffset;if("number"!=typeof i)return NaN;let a=ex(e);return a.length?a.end(a.length-1)-i:NaN},eO=.034,eP=(e,t,i=eO)=>e>t||((e,t,i=eO)=>Math.abs(e-t)<=i)(e,t,i),eU=(e,t)=>{var i,a,r;if(!t||!e.buffered.length)return;if(e.readyState>2)return!1;let n=t.currentLevel>=0?null==(a=null==(i=t.levels)?void 0:i[t.currentLevel])?void 0:a.details:null==(r=t.levels.find(e=>!!e.details))?void 0:r.details;if(!n||n.live)return;let{fragments:s}=n;if(!(null!=s&&s.length))return;if(e.currentTime<e.duration-(n.targetduration+.5))return!1;let o=s[s.length-1];if(e.currentTime<=o.start)return!1;let l=o.start+o.duration/2,d=e.buffered.start(e.buffered.length-1),u=e.buffered.end(e.buffered.length-1);return l>d&&l<u},eW=(e,t)=>e.ended||e.loop?e.ended:!!(t&&eU(e,t))||((e,t=eO)=>e.paused&&eP(e.currentTime,e.duration,t))(e),e$=(e,t,i)=>{var a,n,s;eB(t,i,e);let{metadata:o={}}=e,{view_session_id:l=ew()}=o,d=null!=(a=null==e?void 0:e.metadata)&&a.video_id?e.metadata.video_id:eZ(e)&&null!=(s=null!=(n=eR(e.playbackId))?n:eC(e.src))?s:e.src;o.view_session_id=l,o.video_id=d,e.metadata=o,e.drmTypeCb=e=>{var i;null==(i=t.mux)||i.emit("hb",{view_drm_type:e})},ey.set(t,{retryCount:0});let u=eV(e,t),h=(({preload:e,src:t},i,a)=>{let r=e=>{null!=e&&["","none","metadata","auto"].includes(e)?i.setAttribute("preload",e):i.removeAttribute("preload")};if(!a)return r(e),r;let n=!1,s=!1,o=a.config.maxBufferLength,l=a.config.maxBufferSize,d=e=>{r(e);let t=null!=e?e:i.preload;s||"none"===t||("metadata"===t?(a.config.maxBufferLength=1,a.config.maxBufferSize=1):(a.config.maxBufferLength=o,a.config.maxBufferSize=l),u())},u=()=>{!n&&t&&(n=!0,a.loadSource(t))};return y(i,"play",()=>{s=!0,a.config.maxBufferLength=o,a.config.maxBufferSize=l,u()},{once:!0}),d(e),d})(e,t,u);null!=e&&e.muxDataKeepSession&&null!=t&&t.mux&&!t.mux.deleted?u&&t.mux.addHLSJS({hlsjs:u,Hls:u?r:void 0}):eQ(e,t,u),ez(e,t,u),G(t),J(t);let c=((e,t,i)=>{let{autoplay:a}=e,n=!1,s=!1,o=x(a)?a:!!a,l=()=>{n||y(t,"playing",()=>{n=!0},{once:!0})};if(l(),y(t,"loadstart",()=>{n=!1,l(),N(t,o)},{once:!0}),y(t,"loadstart",()=>{i||(s=e.streamType&&e.streamType!==m.UNKNOWN?e.streamType===m.LIVE:!Number.isFinite(t.duration)),N(t,o)},{once:!0}),i&&i.once(r.Events.LEVEL_LOADED,(t,i)=>{var a;s=e.streamType&&e.streamType!==m.UNKNOWN?e.streamType===m.LIVE:null!=(a=i.details.live)&&a}),!o){let a=()=>{!s||Number.isFinite(e.startTime)||(null!=i&&i.liveSyncPosition?t.currentTime=i.liveSyncPosition:Number.isFinite(t.seekable.end(0))&&(t.currentTime=t.seekable.end(0)))};i&&y(t,"play",()=>{"metadata"===t.preload?i.once(r.Events.LEVEL_UPDATED,a):a()},{once:!0})}return e=>{n||N(t,o=x(e)?e:!!e)}})(e,t,u);return{engine:u,setAutoplay:c,setPreload:h}},eB=(e,t,i)=>{let a=null==t?void 0:t.engine;null!=e&&e.mux&&!e.mux.deleted&&(null!=i&&i.muxDataKeepSession?a&&e.mux.removeHLSJS():(e.mux.destroy(),delete e.mux)),a&&(a.detachMedia(),a.destroy()),e&&(e.hasAttribute("src")&&(e.removeAttribute("src"),e.load()),e.removeEventListener("error",eJ),e.removeEventListener("error",e1),e.removeEventListener("durationchange",eX),ey.delete(e),e.dispatchEvent(new Event("teardown")))};function eH(e,t){var i;let a=k(e);if(a!==v.M3U8)return!0;let r=!a||null==(i=t.canPlayType(a))||i,{preferPlayback:n}=e,s=n===h.MSE,o=n===h.NATIVE,l=ek&&(s||eA||!(/^((?!chrome|android).)*safari/i.test(eg)&&t.canPlayType("application/vnd.apple.mpegurl")));return r&&(o||!l)}var eV=(e,t)=>{let{debug:i,streamType:a,startTime:n=-1,metadata:s,preferCmcd:o,_hlsConfig:l={},maxAutoResolution:d}=e,u=k(e)===v.M3U8,m=eH(e,t);if(u&&!m&&ek){let u=eK(a),m=eF(e),h=[c.QUERY,c.HEADER].includes(o)?{useHeaders:o===c.HEADER,sessionId:null==s?void 0:s.view_session_id,contentId:null==s?void 0:s.video_id}:void 0,p=null==l.capLevelToPlayerSize?{capLevelController:es}:{},v=new r({debug:i,startPosition:n,cmcd:h,xhrSetup:(e,t)=>{var i,a;if(o&&o!==c.QUERY)return;let r=new URL(t);if(!r.searchParams.has("CMCD"))return;let n=(null!=(a=null==(i=r.searchParams.get("CMCD"))?void 0:i.split(","))?a:[]).filter(e=>e.startsWith("sid")||e.startsWith("cid")).join(",");r.searchParams.set("CMCD",n),e.open("GET",r)},...p,backBufferLength:30,renderTextTracksNatively:!1,liveDurationInfinity:!0,capLevelToPlayerSize:!0,capLevelOnFPSDrop:!0,...u,...m,...l});return p.capLevelController===es&&void 0!==d&&es.setMaxAutoResolution(v,d),v.on(r.Events.MANIFEST_PARSED,async function(e,i){var a,r;let n=null==(a=i.sessionData)?void 0:a["com.apple.hls.chapters"];(null!=n&&n.URI||null!=n&&n.VALUE.toLocaleLowerCase().startsWith("http"))&&eE(null!=(r=null==n?void 0:n.URI)?r:null==n?void 0:n.VALUE,t)}),v}},eK=e=>e===m.LIVE?{backBufferLength:8}:{},eF=e=>{let{tokens:{drm:t}={},playbackId:i,drmTypeCb:a}=e,r=eR(i);return t&&r?{emeEnabled:!0,drmSystems:{"com.apple.fps":{licenseUrl:eq(e,"fairplay"),serverCertificateUrl:ej(e,"fairplay")},"com.widevine.alpha":{licenseUrl:eq(e,"widevine")},"com.microsoft.playready":{licenseUrl:eq(e,"playready")}},requestMediaKeySystemAccessFunc:(e,t)=>("com.widevine.alpha"===e&&(t=[...t.map(e=>{var t;let i=null==(t=e.videoCapabilities)?void 0:t.map(e=>({...e,robustness:"HW_SECURE_ALL"}));return{...e,videoCapabilities:i}}),...t]),navigator.requestMediaKeySystemAccess(e,t).then(t=>{let i=e.includes("fps")?ec:e.includes("playready")?"playready":e.includes("widevine")?"widevine":void 0;return null==a||a(i),t}))}:{}},eY=async e=>{let t=await fetch(e);return 200!==t.status?Promise.reject(t):await t.arrayBuffer()},eG=async(e,t)=>{let i=await fetch(t,{method:"POST",headers:{"Content-type":"application/octet-stream"},body:e});return 200!==i.status?Promise.reject(i):new Uint8Array(await i.arrayBuffer())},eq=({playbackId:e,tokens:{drm:t}={},customDomain:i=eT},a)=>{let r=eR(e);return`https://license.${i.toLocaleLowerCase().endsWith(eT)?i:eT}/license/${a}/${r}?token=${t}`},ej=({playbackId:e,tokens:{drm:t}={},customDomain:i=eT},a)=>{let r=eR(e);return`https://license.${i.toLocaleLowerCase().endsWith(eT)?i:eT}/appcert/${a}/${r}?token=${t}`},eZ=({playbackId:e,src:t,customDomain:i})=>{if(e)return!0;if("string"!=typeof t)return!1;let a=new URL(t,null==window?void 0:window.location.href).hostname.toLocaleLowerCase();return a.includes(eT)||!!i&&a.includes(i.toLocaleLowerCase())},eQ=(e,t,i)=>{var n;let{envKey:s,disableTracking:o,muxDataSDK:l=a.default,muxDataSDKOptions:d={}}=e,u=eZ(e);if(!o&&(s||u)){let{playerInitTime:a,playerSoftwareName:o,playerSoftwareVersion:u,beaconCollectionDomain:m,debug:h,disableCookies:c}=e,p={...e.metadata,video_title:(null==(n=null==e?void 0:e.metadata)?void 0:n.video_title)||void 0};l.monitor(t,{debug:h,beaconCollectionDomain:m,hlsjs:i,Hls:i?r:void 0,automaticErrorTracking:!1,errorTranslator:t=>"string"!=typeof t.player_error_code&&("function"==typeof e.errorTranslator?e.errorTranslator(t):t),disableCookies:c,...d,data:{...s?{env_key:s}:{},player_software_name:o,player_software:o,player_software_version:u,player_init_time:a,...p}})}},ez=(e,t,i)=>{var a,o;let d=eH(e,t),{src:u,customDomain:h=eT}=e,c=()=>{t.ended||e.disablePseudoEnded||!eW(t,i)||(eU(t,i)?t.currentTime=t.buffered.end(t.buffered.length-1):t.dispatchEvent(new Event("ended")))},p,v,b=()=>{let e=ex(t),i,a;e.length>0&&(i=e.start(0),a=e.end(0)),(v!==a||p!==i)&&t.dispatchEvent(new CustomEvent("seekablechange",{composed:!0})),p=i,v=a};if(y(t,"durationchange",b),t&&d){let i=k(e);if("string"==typeof u){let r,d;if(u.endsWith(".mp4")&&u.includes(h)){let e=eC(u);eE(new URL(`https://stream.${h}/${e}/metadata.json`).toString(),t)}let c=()=>{if(eL(t)!==m.LIVE||Number.isFinite(t.duration))return;let e=setInterval(b,1e3);t.addEventListener("teardown",()=>{clearInterval(e)},{once:!0}),y(t,"durationchange",()=>{Number.isFinite(t.duration)&&clearInterval(e)})},p=async()=>eb(u,t,i).then(c).catch(i=>{if(i instanceof Response){let a=ea(i,n.VIDEO,e);if(a)return void e0(t,a)}});if("none"===t.preload){let e=()=>{p(),t.removeEventListener("loadedmetadata",i)},i=()=>{p(),t.removeEventListener("play",e)};y(t,"play",e,{once:!0}),y(t,"loadedmetadata",i,{once:!0})}else p();null!=(a=e.tokens)&&a.drm?(r=async i=>{let a=await navigator.requestMediaKeySystemAccess("com.apple.fps",[{initDataTypes:[i],videoCapabilities:[{contentType:"application/vnd.apple.mpegurl",robustness:""}],distinctiveIdentifier:"not-allowed",persistentState:"not-allowed",sessionTypes:["temporary"]}]).then(t=>{var i;return null==(i=e.drmTypeCb)||i.call(e,ec),t}).catch(()=>{let e=new l(M("Cannot play DRM-protected content with current security configuration on this browser. Try playing in another browser."),l.MEDIA_ERR_ENCRYPTED,!0);e.errorCategory=n.DRM,e.muxCode=s.ENCRYPTED_UNSUPPORTED_KEY_SYSTEM,e0(t,e)});if(!a)return;let r=await a.createMediaKeys();try{let t=await eY(ej(e,"fairplay")).catch(t=>{if(t instanceof Response){let i=ea(t,n.DRM,e);return console.error("mediaError",null==i?void 0:i.message,null==i?void 0:i.context),i?Promise.reject(i):Promise.reject(Error("Unexpected error in app cert request"))}return Promise.reject(t)});await r.setServerCertificate(t).catch(()=>{let e=M("Your server certificate failed when attempting to set it. This may be an issue with a no longer valid certificate."),t=new l(e,l.MEDIA_ERR_ENCRYPTED,!0);return t.errorCategory=n.DRM,t.muxCode=s.ENCRYPTED_UPDATE_SERVER_CERT_FAILED,Promise.reject(t)})}catch(e){e0(t,e);return}await t.setMediaKeys(r)},d=async(i,a)=>{let r=t.mediaKeys.createSession(),o=()=>{r.keyStatuses.forEach(e=>{let i;"internal-error"===e?((i=new l(M("The DRM Content Decryption Module system had an internal failure. Try reloading the page, upading your browser, or playing in another browser."),l.MEDIA_ERR_ENCRYPTED,!0)).errorCategory=n.DRM,i.muxCode=s.ENCRYPTED_CDM_ERROR):("output-restricted"===e||"output-downscaled"===e)&&((i=new l(M("DRM playback is being attempted in an environment that is not sufficiently secure. User may see black screen."),l.MEDIA_ERR_ENCRYPTED,!1)).errorCategory=n.DRM,i.muxCode=s.ENCRYPTED_OUTPUT_RESTRICTED),i&&e0(t,i)})},d=async i=>{let a=i.message;try{let i=await eG(a,eq(e,"fairplay"));try{await r.update(i)}catch{let e=M("Failed to update DRM license. This may be an issue with the player or your protected content."),i=new l(e,l.MEDIA_ERR_ENCRYPTED,!0);i.errorCategory=n.DRM,i.muxCode=s.ENCRYPTED_UPDATE_LICENSE_FAILED,e0(t,i)}}catch(i){if(i instanceof Response){let a=ea(i,n.DRM,e);if(console.error("mediaError",null==a?void 0:a.message,null==a?void 0:a.context),a)return void e0(t,a);console.error("Unexpected error in license key request",i);return}console.error(i)}};r.addEventListener("keystatuseschange",o),r.addEventListener("message",d),t.addEventListener("teardown",()=>{r.removeEventListener("keystatuseschange",o),r.removeEventListener("message",d),r.close()},{once:!0}),await r.generateRequest(i,a).catch(e=>{console.error("Failed to generate license request",e);let t=new l(M("Failed to generate a DRM license request. This may be an issue with the player or your protected content."),l.MEDIA_ERR_ENCRYPTED,!0);return t.errorCategory=n.DRM,t.muxCode=s.ENCRYPTED_GENERATE_REQUEST_FAILED,Promise.reject(t)})},y(t,"encrypted",async e=>{try{let i=e.initDataType;if("skd"!==i)return void console.error(`Received unexpected initialization data type "${i}"`);t.mediaKeys||await r(i);let a=e.initData;if(null==a)return void console.error(`Could not start encrypted playback due to missing initData in ${e.type} event`);await d(i,a)}catch(e){e0(t,e);return}})):y(t,"encrypted",()=>{let e=new l(M("Attempting to play DRM-protected content without providing a DRM token."),l.MEDIA_ERR_ENCRYPTED,!0);e.errorCategory=n.DRM,e.muxCode=s.ENCRYPTED_MISSING_TOKEN,e0(t,e)},{once:!0}),t.setAttribute("src",u),e.startTime&&((null!=(o=ey.get(t))?o:{}).startTime=e.startTime,t.addEventListener("durationchange",eX,{once:!0}))}else t.removeAttribute("src");t.addEventListener("error",eJ),t.addEventListener("error",e1),t.addEventListener("emptied",()=>{t.querySelectorAll("track[data-removeondestroy]").forEach(e=>{e.remove()})},{once:!0}),y(t,"pause",c),y(t,"seeked",c),y(t,"play",()=>{t.ended||eP(t.currentTime,t.duration)&&(t.currentTime=t.seekable.length?t.seekable.start(0):0)})}else{let a,n;i&&u?(i.once(r.Events.LEVEL_LOADED,(e,a)=>{((e,t,i)=>{var a,r,n,s,o,l,d,u,h;let c,p,v,b,E,{streamType:g,targetLiveWindow:f,liveEdgeStartOffset:A,lowLatency:y}=(p=_(c=e.type),v=w(c),E=!!(null!=(h=e.partList)&&h.length),p===m.LIVE&&(b=E?2*e.partTarget:3*e.targetduration),{streamType:p,targetLiveWindow:v,liveEdgeStartOffset:b,lowLatency:E});if(g===m.LIVE){y?(i.config.backBufferLength=null!=(a=i.userConfig.backBufferLength)?a:4,i.config.maxFragLookUpTolerance=null!=(r=i.userConfig.maxFragLookUpTolerance)?r:.001,i.config.abrBandWidthUpFactor=null!=(n=i.userConfig.abrBandWidthUpFactor)?n:i.config.abrBandWidthFactor):i.config.backBufferLength=null!=(s=i.userConfig.backBufferLength)?s:8;let e=Object.freeze({get length(){return t.seekable.length},start:e=>t.seekable.start(e),end(e){var a;return e>this.length||e<0||Number.isFinite(t.duration)?t.seekable.end(e):null!=(a=i.liveSyncPosition)?a:t.seekable.end(e)}});(null!=(o=ey.get(t))?o:{}).seekable=e}(null!=(l=ey.get(t))?l:{}).liveEdgeStartOffset=A,(null!=(d=ey.get(t))?d:{}).targetLiveWindow=f,t.dispatchEvent(new CustomEvent("targetlivewindowchange",{composed:!0,bubbles:!0})),(null!=(u=ey.get(t))?u:{}).streamType=g,t.dispatchEvent(new CustomEvent("streamtypechange",{composed:!0,bubbles:!0}))})(a.details,t,i),b(),eL(t)!==m.LIVE||Number.isFinite(t.duration)||(i.on(r.Events.LEVEL_UPDATED,b),y(t,"durationchange",()=>{Number.isFinite(t.duration)&&i.off(r.Events.LEVELS_UPDATED,b)}))}),i.on(r.Events.ERROR,(a,r)=>{var n,o;let d=e2(r,e);if(d.muxCode===s.NETWORK_NOT_READY){let e=null!=(n=ey.get(t))?n:{},a=null!=(o=e.retryCount)?o:0;if(a<6){let n=0===a?5e3:6e4,s=new l(`Retrying in ${n/1e3} seconds...`,d.code,d.fatal);Object.assign(s,d),e0(t,s),setTimeout(()=>{e.retryCount=a+1,"manifestLoadError"===r.details&&r.url&&i.loadSource(r.url)},n);return}{e.retryCount=0;let i=new l('Try again later or <a href="#" onclick="window.location.reload(); return false;" style="color: #4a90e2;">click here to retry</a>',d.code,d.fatal);Object.assign(i,d),e0(t,i);return}}e0(t,d)}),i.on(r.Events.MANIFEST_LOADED,()=>{let e=ey.get(t);e&&e.error&&(e.error=null,e.retryCount=0,t.dispatchEvent(new Event("emptied")),t.dispatchEvent(new Event("loadstart")))}),t.addEventListener("error",e1),y(t,"waiting",c),function(e,t){var i;if(!("videoTracks"in e))return;let a=new WeakMap;t.on(r.Events.MANIFEST_PARSED,function(t,i){s();let r=e.addVideoTrack("main");for(let[e,t]of(r.selected=!0,i.levels.entries())){let i=r.addRendition(t.url[0],t.width,t.height,t.videoCodec,t.bitrate);a.set(t,`${e}`),i.id=`${e}`}}),t.on(r.Events.AUDIO_TRACKS_UPDATED,function(t,i){for(let t of(n(),i.audioTracks)){let i=t.default?"main":"alternative",a=e.addAudioTrack(i,t.name,t.lang);a.id=`${t.id}`,t.default&&(a.enabled=!0)}}),e.audioTracks.addEventListener("change",()=>{var i;let a=+(null==(i=[...e.audioTracks].find(e=>e.enabled))?void 0:i.id),r=t.audioTracks.map(e=>e.id);a!=t.audioTrack&&r.includes(a)&&(t.audioTrack=a)}),t.on(r.Events.LEVELS_UPDATED,function(t,i){var r;let n=e.videoTracks[null!=(r=e.videoTracks.selectedIndex)?r:0];if(!n)return;let s=i.levels.map(e=>a.get(e));for(let t of e.videoRenditions)t.id&&!s.includes(t.id)&&n.removeRendition(t)}),null==(i=e.videoRenditions)||i.addEventListener("change",e=>{let i=e.target.selectedIndex;i!=t.nextLevel&&(t.nextLevel=i)});let n=()=>{for(let t of e.audioTracks)e.removeAudioTrack(t)},s=()=>{(()=>{for(let t of e.videoTracks)e.removeVideoTrack(t)})(),n()};t.once(r.Events.DESTROYING,s)}(e,i),i.on(r.Events.NON_NATIVE_TEXT_TRACKS_FOUND,(e,{tracks:a})=>{a.forEach(e=>{var a,r;let n=null!=(a=e.subtitleTrack)?a:e.closedCaptions,s=i.subtitleTracks.findIndex(({lang:t,name:i,type:a})=>t==(null==n?void 0:n.lang)&&i===e.label&&a.toLowerCase()===e.kind),o=(null!=(r=e._id)?r:e.default)?"default":`${e.kind}${s}`;P(t,e.kind,e.label,null==n?void 0:n.lang,o,e.default)})}),a=()=>{if(!i.subtitleTracks.length)return;let e=Array.from(t.textTracks).find(e=>e.id&&"showing"===e.mode&&["subtitles","captions"].includes(e.kind));if(!e)return;let a=i.subtitleTracks[i.subtitleTrack],r=a?a.default?"default":`${i.subtitleTracks[i.subtitleTrack].type.toLowerCase()}${i.subtitleTrack}`:void 0;if(i.subtitleTrack<0||(null==e?void 0:e.id)!==r){let t=i.subtitleTracks.findIndex(({lang:t,name:i,type:a,default:r})=>"default"===e.id&&r||t==e.language&&i===e.label&&a.toLowerCase()===e.kind);i.subtitleTrack=t}(null==e?void 0:e.id)===r&&e.cues&&Array.from(e.cues).forEach(t=>{e.addCue(t)})},t.textTracks.addEventListener("change",a),i.on(r.Events.CUES_PARSED,(e,{track:i,cues:a})=>{let r=t.textTracks.getTrackById(i);if(!r)return;let n="disabled"===r.mode;n&&(r.mode="hidden"),a.forEach(e=>{var t;null!=(t=r.cues)&&t.getCueById(e.id)||r.addCue(e)}),n&&(r.mode="disabled")}),i.once(r.Events.DESTROYING,()=>{t.textTracks.removeEventListener("change",a),t.querySelectorAll("track[data-removeondestroy]").forEach(e=>{e.remove()})}),n=()=>{Array.from(t.textTracks).forEach(e=>{var i,a;if(!["subtitles","caption"].includes(e.kind)&&("thumbnails"===e.label||"chapters"===e.kind)){if(!(null!=(i=e.cues)&&i.length)){let i="track";e.kind&&(i+=`[kind="${e.kind}"]`),e.label&&(i+=`[label="${e.label}"]`);let r=t.querySelector(i),n=null!=(a=null==r?void 0:r.getAttribute("src"))?a:"";null==r||r.removeAttribute("src"),setTimeout(()=>{null==r||r.setAttribute("src",n)},0)}"hidden"!==e.mode&&(e.mode="hidden")}})},i.once(r.Events.MANIFEST_LOADED,n),i.once(r.Events.MEDIA_ATTACHED,n),i.attachMedia(t)):console.error("It looks like the video you're trying to play will not work on this system! If possible, try upgrading to the newest versions of your browser or software.")}};function eX(e){var t;let i=e.target,a=null==(t=ey.get(i))?void 0:t.startTime;if(a&&function(e,t,i){t&&i>t&&(i=t);for(let t=0;t<e.length;t++)if(e.start(t)<=i&&e.end(t)>=i)return!0;return!1}(i.seekable,i.duration,a)){let e="auto"===i.preload;e&&(i.preload="none"),i.currentTime=a,e&&(i.preload="auto")}}async function eJ(e){if(!e.isTrusted)return;e.stopImmediatePropagation();let t=e.target;if(!(null!=t&&t.error))return;let{message:i,code:a}=t.error,r=new l(i,a);if(t.src&&a===l.MEDIA_ERR_SRC_NOT_SUPPORTED&&t.readyState===HTMLMediaElement.HAVE_NOTHING)return void setTimeout(()=>{var e;let i=null!=(e=eS(t))?e:t.error;(null==i?void 0:i.code)===l.MEDIA_ERR_SRC_NOT_SUPPORTED&&e0(t,r)},500);if(t.src&&(a!==l.MEDIA_ERR_DECODE||void 0!==a))try{let{status:e}=await fetch(t.src);r.data={response:{code:e}}}catch{}e0(t,r)}function e0(e,t){var i;t.fatal&&((null!=(i=ey.get(e))?i:{}).error=t,e.dispatchEvent(new CustomEvent("error",{detail:t})))}function e1(e){var t,i;if(!(e instanceof CustomEvent)||!(e.detail instanceof l))return;let a=e.target,r=e.detail;r&&r.fatal&&((null!=(t=ey.get(a))?t:{}).error=r,null==(i=a.mux)||i.emit("error",{player_error_code:r.code,player_error_message:r.message,player_error_context:r.context}))}var e2=(e,t)=>{var i,a,o;e.fatal?console.error("getErrorFromHlsErrorData()",e):t.debug&&console.warn("getErrorFromHlsErrorData() (non-fatal)",e);let d={[r.ErrorTypes.NETWORK_ERROR]:l.MEDIA_ERR_NETWORK,[r.ErrorTypes.MEDIA_ERROR]:l.MEDIA_ERR_DECODE,[r.ErrorTypes.KEY_SYSTEM_ERROR]:l.MEDIA_ERR_ENCRYPTED},u,m=[r.ErrorDetails.KEY_SYSTEM_LICENSE_REQUEST_FAILED,r.ErrorDetails.KEY_SYSTEM_SERVER_CERTIFICATE_REQUEST_FAILED].includes(e.details)?l.MEDIA_ERR_NETWORK:d[e.type];if(m===l.MEDIA_ERR_NETWORK&&e.response){let s=null!=(i=e.type===r.ErrorTypes.KEY_SYSTEM_ERROR?n.DRM:e.type===r.ErrorTypes.NETWORK_ERROR?n.VIDEO:void 0)?i:n.VIDEO;u=null!=(a=ea(e.response,s,t,e.fatal))?a:new l("",m,e.fatal)}else m===l.MEDIA_ERR_ENCRYPTED?e.details===r.ErrorDetails.KEY_SYSTEM_NO_CONFIGURED_LICENSE?((u=new l(M("Attempting to play DRM-protected content without providing a DRM token."),l.MEDIA_ERR_ENCRYPTED,e.fatal)).errorCategory=n.DRM,u.muxCode=s.ENCRYPTED_MISSING_TOKEN):e.details===r.ErrorDetails.KEY_SYSTEM_NO_ACCESS?((u=new l(M("Cannot play DRM-protected content with current security configuration on this browser. Try playing in another browser."),l.MEDIA_ERR_ENCRYPTED,e.fatal)).errorCategory=n.DRM,u.muxCode=s.ENCRYPTED_UNSUPPORTED_KEY_SYSTEM):e.details===r.ErrorDetails.KEY_SYSTEM_NO_SESSION?((u=new l(M("Failed to generate a DRM license request. This may be an issue with the player or your protected content."),l.MEDIA_ERR_ENCRYPTED,!0)).errorCategory=n.DRM,u.muxCode=s.ENCRYPTED_GENERATE_REQUEST_FAILED):e.details===r.ErrorDetails.KEY_SYSTEM_SESSION_UPDATE_FAILED?((u=new l(M("Failed to update DRM license. This may be an issue with the player or your protected content."),l.MEDIA_ERR_ENCRYPTED,e.fatal)).errorCategory=n.DRM,u.muxCode=s.ENCRYPTED_UPDATE_LICENSE_FAILED):e.details===r.ErrorDetails.KEY_SYSTEM_SERVER_CERTIFICATE_UPDATE_FAILED?((u=new l(M("Your server certificate failed when attempting to set it. This may be an issue with a no longer valid certificate."),l.MEDIA_ERR_ENCRYPTED,e.fatal)).errorCategory=n.DRM,u.muxCode=s.ENCRYPTED_UPDATE_SERVER_CERT_FAILED):e.details===r.ErrorDetails.KEY_SYSTEM_STATUS_INTERNAL_ERROR?((u=new l(M("The DRM Content Decryption Module system had an internal failure. Try reloading the page, upading your browser, or playing in another browser."),l.MEDIA_ERR_ENCRYPTED,e.fatal)).errorCategory=n.DRM,u.muxCode=s.ENCRYPTED_CDM_ERROR):e.details===r.ErrorDetails.KEY_SYSTEM_STATUS_OUTPUT_RESTRICTED?((u=new l(M("DRM playback is being attempted in an environment that is not sufficiently secure. User may see black screen."),l.MEDIA_ERR_ENCRYPTED,!1)).errorCategory=n.DRM,u.muxCode=s.ENCRYPTED_OUTPUT_RESTRICTED):((u=new l(e.error.message,l.MEDIA_ERR_ENCRYPTED,e.fatal)).errorCategory=n.DRM,u.muxCode=s.ENCRYPTED_ERROR):u=new l("",m,e.fatal);return u.context||(u.context=`${e.url?`url: ${e.url}
`:""}${e.response&&(e.response.code||e.response.text)?`response: ${e.response.code}, ${e.response.text}
`:""}${e.reason?`failure reason: ${e.reason}
`:""}${e.level?`level: ${e.level}
`:""}${e.parent?`parent stream controller: ${e.parent}
`:""}${e.buffer?`buffer length: ${e.buffer}
`:""}${e.error?`error: ${e.error}
`:""}${e.event?`event: ${e.event}
`:""}${e.err?`error message: ${null==(o=e.err)?void 0:o.message}
`:""}`),u.data=e,u};e.s(["CmcdTypeValues",()=>p,"MaxResolution",()=>E,"MediaError",()=>l,"MinResolution",()=>g,"MuxErrorCategory",()=>n,"MuxErrorCode",()=>s,"MuxJWTAud",()=>ei,"PlaybackTypes",()=>h,"RenditionOrder",()=>f,"StreamTypes",()=>m,"addChapters",()=>Q,"addCuePoints",()=>V,"addTextTrack",()=>P,"errorCategoryToTokenNameOrPrefix",()=>o,"generatePlayerInitTime",()=>e_,"getActiveChapter",()=>X,"getActiveCuePoint",()=>Y,"getChapters",()=>z,"getCuePoints",()=>F,"getCurrentPdt",()=>et,"getEnded",()=>eW,"getError",()=>eS,"getLiveEdgeStart",()=>eN,"getMetadata",()=>eM,"getSeekable",()=>ex,"getStartDate",()=>ee,"getStreamType",()=>eL,"getTargetLiveWindow",()=>eD,"i18n",()=>M,"initialize",()=>e$,"parseJwt",()=>S,"removeTextTrack",()=>U,"teardown",()=>eB,"toMuxVideoURL",()=>eI,"toPlaybackIdFromSrc",()=>eC,"toPlaybackIdParts",()=>T],132655);var e3,e4,e5,e9,e8,e6,e7,te,tt,ti,ta,tr,tn=e.i(502709),ts=e=>{throw TypeError(e)},to=(e,t,i)=>t.has(e)||ts("Cannot "+i),tl=(e,t,i)=>(to(e,t,"read from private field"),i?i.call(e):t.get(e)),td=(e,t,i)=>t.has(e)?ts("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,i),tu=(e,t,i,a)=>(to(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i),tm=(e,t,i)=>(to(e,t,"access private method"),i),th=(()=>{try{return"0.29.2"}catch{}return"UNKNOWN"})(),tc=`
<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" part="logo" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2" viewBox="0 0 1600 500"><g fill="#fff"><path d="M994.287 93.486c-17.121 0-31-13.879-31-31 0-17.121 13.879-31 31-31 17.121 0 31 13.879 31 31 0 17.121-13.879 31-31 31m0-93.486c-34.509 0-62.484 27.976-62.484 62.486v187.511c0 68.943-56.09 125.033-125.032 125.033s-125.03-56.09-125.03-125.033V62.486C681.741 27.976 653.765 0 619.256 0s-62.484 27.976-62.484 62.486v187.511C556.772 387.85 668.921 500 806.771 500c137.851 0 250.001-112.15 250.001-250.003V62.486c0-34.51-27.976-62.486-62.485-62.486M1537.51 468.511c-17.121 0-31-13.879-31-31 0-17.121 13.879-31 31-31 17.121 0 31 13.879 31 31 0 17.121-13.879 31-31 31m-275.883-218.509-143.33 143.329c-24.402 24.402-24.402 63.966 0 88.368 24.402 24.402 63.967 24.402 88.369 0l143.33-143.329 143.328 143.329c24.402 24.4 63.967 24.402 88.369 0 24.403-24.402 24.403-63.966.001-88.368l-143.33-143.329.001-.004 143.329-143.329c24.402-24.402 24.402-63.965 0-88.367s-63.967-24.402-88.369 0L1349.996 161.63 1206.667 18.302c-24.402-24.401-63.967-24.402-88.369 0s-24.402 63.965 0 88.367l143.329 143.329v.004ZM437.511 468.521c-17.121 0-31-13.879-31-31 0-17.121 13.879-31 31-31 17.121 0 31 13.879 31 31 0 17.121-13.879 31-31 31M461.426 4.759C438.078-4.913 411.2.432 393.33 18.303L249.999 161.632 106.669 18.303C88.798.432 61.922-4.913 38.573 4.759 15.224 14.43-.001 37.214-.001 62.488v375.026c0 34.51 27.977 62.486 62.487 62.486 34.51 0 62.486-27.976 62.486-62.486V213.341l80.843 80.844c24.404 24.402 63.965 24.402 88.369 0l80.843-80.844v224.173c0 34.51 27.976 62.486 62.486 62.486s62.486-27.976 62.486-62.486V62.488c0-25.274-15.224-48.058-38.573-57.729" style="fill-rule:nonzero"/></g></svg>`,tp={BEACON_COLLECTION_DOMAIN:"beacon-collection-domain",CUSTOM_DOMAIN:"custom-domain",DEBUG:"debug",DISABLE_TRACKING:"disable-tracking",DISABLE_COOKIES:"disable-cookies",DISABLE_PSEUDO_ENDED:"disable-pseudo-ended",DRM_TOKEN:"drm-token",PLAYBACK_TOKEN:"playback-token",ENV_KEY:"env-key",MAX_RESOLUTION:"max-resolution",MIN_RESOLUTION:"min-resolution",MAX_AUTO_RESOLUTION:"max-auto-resolution",RENDITION_ORDER:"rendition-order",PROGRAM_START_TIME:"program-start-time",PROGRAM_END_TIME:"program-end-time",ASSET_START_TIME:"asset-start-time",ASSET_END_TIME:"asset-end-time",METADATA_URL:"metadata-url",PLAYBACK_ID:"playback-id",PLAYER_SOFTWARE_NAME:"player-software-name",PLAYER_SOFTWARE_VERSION:"player-software-version",PLAYER_INIT_TIME:"player-init-time",PREFER_CMCD:"prefer-cmcd",PREFER_PLAYBACK:"prefer-playback",START_TIME:"start-time",STREAM_TYPE:"stream-type",TARGET_LIVE_WINDOW:"target-live-window",LIVE_EDGE_OFFSET:"live-edge-offset",TYPE:"type",LOGO:"logo"},tv=Object.values(tp),tb="mux-video",tE=class extends tn.CustomVideoElement{constructor(){super(),td(this,ta),td(this,e3),td(this,e4),td(this,e5),td(this,e9,{}),td(this,e8,{}),td(this,e6),td(this,e7),td(this,te),td(this,tt),td(this,ti,""),tu(this,e5,e_()),this.nativeEl.addEventListener("muxmetadata",e=>{var t;let i=eM(this.nativeEl),a=null!=(t=this.metadata)?t:{};this.metadata={...i,...a},(null==i?void 0:i["com.mux.video.branding"])==="mux-free-plan"&&(tu(this,ti,"default"),this.updateLogo())})}static get NAME(){return tb}static get VERSION(){return th}static get observedAttributes(){var e;return[...tv,...null!=(e=tn.CustomVideoElement.observedAttributes)?e:[]]}static getLogoHTML(e){return e&&"false"!==e?"default"===e?tc:`<img part="logo" src="${e}" />`:""}static getTemplateHTML(e={}){var t;return`
      ${tn.CustomVideoElement.getTemplateHTML(e)}
      <style>
        :host {
          position: relative;
        }
        slot[name="logo"] {
          display: flex;
          justify-content: end;
          position: absolute;
          top: 1rem;
          right: 1rem;
          opacity: 0;
          transition: opacity 0.25s ease-in-out;
          z-index: 1;
        }
        slot[name="logo"]:has([part="logo"]) {
          opacity: 1;
        }
        slot[name="logo"] [part="logo"] {
          width: 5rem;
          pointer-events: none;
          user-select: none;
        }
      </style>
      <slot name="logo">
        ${this.getLogoHTML(null!=(t=e[tp.LOGO])?t:"")}
      </slot>
    `}get preferCmcd(){var e;return null!=(e=this.getAttribute(tp.PREFER_CMCD))?e:void 0}set preferCmcd(e){e!==this.preferCmcd&&(e?p.includes(e)?this.setAttribute(tp.PREFER_CMCD,e):console.warn(`Invalid value for preferCmcd. Must be one of ${p.join()}`):this.removeAttribute(tp.PREFER_CMCD))}get playerInitTime(){return this.hasAttribute(tp.PLAYER_INIT_TIME)?+this.getAttribute(tp.PLAYER_INIT_TIME):tl(this,e5)}set playerInitTime(e){e!=this.playerInitTime&&(null==e?this.removeAttribute(tp.PLAYER_INIT_TIME):this.setAttribute(tp.PLAYER_INIT_TIME,`${+e}`))}get playerSoftwareName(){var e;return null!=(e=tl(this,te))?e:tb}set playerSoftwareName(e){tu(this,te,e)}get playerSoftwareVersion(){var e;return null!=(e=tl(this,e7))?e:th}set playerSoftwareVersion(e){tu(this,e7,e)}get _hls(){var e;return null==(e=tl(this,e3))?void 0:e.engine}get mux(){var e;return null==(e=this.nativeEl)?void 0:e.mux}get error(){var e;return null!=(e=eS(this.nativeEl))?e:null}get errorTranslator(){return tl(this,tt)}set errorTranslator(e){tu(this,tt,e)}get src(){return this.getAttribute("src")}set src(e){e!==this.src&&(null==e?this.removeAttribute("src"):this.setAttribute("src",e))}get type(){var e;return null!=(e=this.getAttribute(tp.TYPE))?e:void 0}set type(e){e!==this.type&&(e?this.setAttribute(tp.TYPE,e):this.removeAttribute(tp.TYPE))}get preload(){let e=this.getAttribute("preload");return""===e?"auto":["none","metadata","auto"].includes(e)?e:super.preload}set preload(e){e!=this.getAttribute("preload")&&(["","none","metadata","auto"].includes(e)?this.setAttribute("preload",e):this.removeAttribute("preload"))}get debug(){return null!=this.getAttribute(tp.DEBUG)}set debug(e){e!==this.debug&&(e?this.setAttribute(tp.DEBUG,""):this.removeAttribute(tp.DEBUG))}get disableTracking(){return this.hasAttribute(tp.DISABLE_TRACKING)}set disableTracking(e){e!==this.disableTracking&&this.toggleAttribute(tp.DISABLE_TRACKING,!!e)}get disableCookies(){return this.hasAttribute(tp.DISABLE_COOKIES)}set disableCookies(e){e!==this.disableCookies&&(e?this.setAttribute(tp.DISABLE_COOKIES,""):this.removeAttribute(tp.DISABLE_COOKIES))}get disablePseudoEnded(){return this.hasAttribute(tp.DISABLE_PSEUDO_ENDED)}set disablePseudoEnded(e){e!==this.disablePseudoEnded&&(e?this.setAttribute(tp.DISABLE_PSEUDO_ENDED,""):this.removeAttribute(tp.DISABLE_PSEUDO_ENDED))}get startTime(){let e=this.getAttribute(tp.START_TIME);if(null==e)return;let t=+e;return Number.isNaN(t)?void 0:t}set startTime(e){e!==this.startTime&&(null==e?this.removeAttribute(tp.START_TIME):this.setAttribute(tp.START_TIME,`${e}`))}get playbackId(){var e;return this.hasAttribute(tp.PLAYBACK_ID)?this.getAttribute(tp.PLAYBACK_ID):null!=(e=eC(this.src))?e:void 0}set playbackId(e){e!==this.playbackId&&(e?this.setAttribute(tp.PLAYBACK_ID,e):this.removeAttribute(tp.PLAYBACK_ID))}get maxResolution(){var e;return null!=(e=this.getAttribute(tp.MAX_RESOLUTION))?e:void 0}set maxResolution(e){e!==this.maxResolution&&(e?this.setAttribute(tp.MAX_RESOLUTION,e):this.removeAttribute(tp.MAX_RESOLUTION))}get minResolution(){var e;return null!=(e=this.getAttribute(tp.MIN_RESOLUTION))?e:void 0}set minResolution(e){e!==this.minResolution&&(e?this.setAttribute(tp.MIN_RESOLUTION,e):this.removeAttribute(tp.MIN_RESOLUTION))}get maxAutoResolution(){var e;return null!=(e=this.getAttribute(tp.MAX_AUTO_RESOLUTION))?e:void 0}set maxAutoResolution(e){null==e?this.removeAttribute(tp.MAX_AUTO_RESOLUTION):this.setAttribute(tp.MAX_AUTO_RESOLUTION,e)}get renditionOrder(){var e;return null!=(e=this.getAttribute(tp.RENDITION_ORDER))?e:void 0}set renditionOrder(e){e!==this.renditionOrder&&(e?this.setAttribute(tp.RENDITION_ORDER,e):this.removeAttribute(tp.RENDITION_ORDER))}get programStartTime(){let e=this.getAttribute(tp.PROGRAM_START_TIME);if(null==e)return;let t=+e;return Number.isNaN(t)?void 0:t}set programStartTime(e){null==e?this.removeAttribute(tp.PROGRAM_START_TIME):this.setAttribute(tp.PROGRAM_START_TIME,`${e}`)}get programEndTime(){let e=this.getAttribute(tp.PROGRAM_END_TIME);if(null==e)return;let t=+e;return Number.isNaN(t)?void 0:t}set programEndTime(e){null==e?this.removeAttribute(tp.PROGRAM_END_TIME):this.setAttribute(tp.PROGRAM_END_TIME,`${e}`)}get assetStartTime(){let e=this.getAttribute(tp.ASSET_START_TIME);if(null==e)return;let t=+e;return Number.isNaN(t)?void 0:t}set assetStartTime(e){null==e?this.removeAttribute(tp.ASSET_START_TIME):this.setAttribute(tp.ASSET_START_TIME,`${e}`)}get assetEndTime(){let e=this.getAttribute(tp.ASSET_END_TIME);if(null==e)return;let t=+e;return Number.isNaN(t)?void 0:t}set assetEndTime(e){null==e?this.removeAttribute(tp.ASSET_END_TIME):this.setAttribute(tp.ASSET_END_TIME,`${e}`)}get customDomain(){var e;return null!=(e=this.getAttribute(tp.CUSTOM_DOMAIN))?e:void 0}set customDomain(e){e!==this.customDomain&&(e?this.setAttribute(tp.CUSTOM_DOMAIN,e):this.removeAttribute(tp.CUSTOM_DOMAIN))}get drmToken(){var e;return null!=(e=this.getAttribute(tp.DRM_TOKEN))?e:void 0}set drmToken(e){e!==this.drmToken&&(e?this.setAttribute(tp.DRM_TOKEN,e):this.removeAttribute(tp.DRM_TOKEN))}get playbackToken(){var e,t,i,a;if(this.hasAttribute(tp.PLAYBACK_TOKEN))return null!=(e=this.getAttribute(tp.PLAYBACK_TOKEN))?e:void 0;if(this.hasAttribute(tp.PLAYBACK_ID)){let[,e]=T(null!=(t=this.playbackId)?t:"");return null!=(i=new URLSearchParams(e).get("token"))?i:void 0}if(this.src)return null!=(a=new URLSearchParams(this.src).get("token"))?a:void 0}set playbackToken(e){e!==this.playbackToken&&(e?this.setAttribute(tp.PLAYBACK_TOKEN,e):this.removeAttribute(tp.PLAYBACK_TOKEN))}get tokens(){let e=this.getAttribute(tp.PLAYBACK_TOKEN),t=this.getAttribute(tp.DRM_TOKEN);return{...tl(this,e8),...null!=e?{playback:e}:{},...null!=t?{drm:t}:{}}}set tokens(e){tu(this,e8,null!=e?e:{})}get ended(){return eW(this.nativeEl,this._hls)}get envKey(){var e;return null!=(e=this.getAttribute(tp.ENV_KEY))?e:void 0}set envKey(e){e!==this.envKey&&(e?this.setAttribute(tp.ENV_KEY,e):this.removeAttribute(tp.ENV_KEY))}get beaconCollectionDomain(){var e;return null!=(e=this.getAttribute(tp.BEACON_COLLECTION_DOMAIN))?e:void 0}set beaconCollectionDomain(e){e!==this.beaconCollectionDomain&&(e?this.setAttribute(tp.BEACON_COLLECTION_DOMAIN,e):this.removeAttribute(tp.BEACON_COLLECTION_DOMAIN))}get streamType(){var e;return null!=(e=this.getAttribute(tp.STREAM_TYPE))?e:eL(this.nativeEl)}set streamType(e){e!==this.streamType&&(e?this.setAttribute(tp.STREAM_TYPE,e):this.removeAttribute(tp.STREAM_TYPE))}get targetLiveWindow(){return this.hasAttribute(tp.TARGET_LIVE_WINDOW)?+this.getAttribute(tp.TARGET_LIVE_WINDOW):eD(this.nativeEl)}set targetLiveWindow(e){e!=this.targetLiveWindow&&(null==e?this.removeAttribute(tp.TARGET_LIVE_WINDOW):this.setAttribute(tp.TARGET_LIVE_WINDOW,`${+e}`))}get liveEdgeStart(){var e,t;if(this.hasAttribute(tp.LIVE_EDGE_OFFSET)){let{liveEdgeOffset:i}=this,a=null!=(e=this.nativeEl.seekable.end(0))?e:0;return Math.max(null!=(t=this.nativeEl.seekable.start(0))?t:0,a-i)}return eN(this.nativeEl)}get liveEdgeOffset(){if(this.hasAttribute(tp.LIVE_EDGE_OFFSET))return+this.getAttribute(tp.LIVE_EDGE_OFFSET)}set liveEdgeOffset(e){e!=this.liveEdgeOffset&&(null==e?this.removeAttribute(tp.LIVE_EDGE_OFFSET):this.setAttribute(tp.LIVE_EDGE_OFFSET,`${+e}`))}get seekable(){return ex(this.nativeEl)}async addCuePoints(e){return V(this.nativeEl,e)}get activeCuePoint(){return Y(this.nativeEl)}get cuePoints(){return F(this.nativeEl)}async addChapters(e){return Q(this.nativeEl,e)}get activeChapter(){return X(this.nativeEl)}get chapters(){return z(this.nativeEl)}getStartDate(){return ee(this.nativeEl,this._hls)}get currentPdt(){return et(this.nativeEl,this._hls)}get preferPlayback(){let e=this.getAttribute(tp.PREFER_PLAYBACK);if(e===h.MSE||e===h.NATIVE)return e}set preferPlayback(e){e!==this.preferPlayback&&(e===h.MSE||e===h.NATIVE?this.setAttribute(tp.PREFER_PLAYBACK,e):this.removeAttribute(tp.PREFER_PLAYBACK))}get metadata(){return{...this.getAttributeNames().filter(e=>e.startsWith("metadata-")&&![tp.METADATA_URL].includes(e)).reduce((e,t)=>{let i=this.getAttribute(t);return null!=i&&(e[t.replace(/^metadata-/,"").replace(/-/g,"_")]=i),e},{}),...tl(this,e9)}}set metadata(e){tu(this,e9,null!=e?e:{}),this.mux&&this.mux.emit("hb",tl(this,e9))}get _hlsConfig(){return tl(this,e6)}set _hlsConfig(e){tu(this,e6,e)}get logo(){var e;return null!=(e=this.getAttribute(tp.LOGO))?e:tl(this,ti)}set logo(e){e?this.setAttribute(tp.LOGO,e):this.removeAttribute(tp.LOGO)}load(){tu(this,e3,e$(this,this.nativeEl,tl(this,e3)))}unload(){eB(this.nativeEl,tl(this,e3),this),tu(this,e3,void 0)}attributeChangedCallback(e,t,i){var a,r;switch(tn.CustomVideoElement.observedAttributes.includes(e)&&!["src","autoplay","preload"].includes(e)&&super.attributeChangedCallback(e,t,i),e){case tp.PLAYER_SOFTWARE_NAME:this.playerSoftwareName=null!=i?i:void 0;break;case tp.PLAYER_SOFTWARE_VERSION:this.playerSoftwareVersion=null!=i?i:void 0;break;case"src":{let e=!!t,a=!!i;!e&&a?tm(this,ta,tr).call(this):e&&!a?this.unload():e&&a&&(this.unload(),tm(this,ta,tr).call(this));break}case"autoplay":if(i===t)break;null==(a=tl(this,e3))||a.setAutoplay(this.autoplay);break;case"preload":if(i===t)break;null==(r=tl(this,e3))||r.setPreload(i);break;case tp.PLAYBACK_ID:this.src=eI(this);break;case tp.DEBUG:{let e=this.debug;this.mux&&console.info("Cannot toggle debug mode of mux data after initialization. Make sure you set all metadata to override before setting the src."),this._hls&&(this._hls.config.debug=e);break}case tp.METADATA_URL:i&&fetch(i).then(e=>e.json()).then(e=>this.metadata=e).catch(()=>console.error(`Unable to load or parse metadata JSON from metadata-url ${i}!`));break;case tp.STREAM_TYPE:(null==i||i!==t)&&this.dispatchEvent(new CustomEvent("streamtypechange",{composed:!0,bubbles:!0}));break;case tp.TARGET_LIVE_WINDOW:(null==i||i!==t)&&this.dispatchEvent(new CustomEvent("targetlivewindowchange",{composed:!0,bubbles:!0,detail:this.targetLiveWindow}));break;case tp.LOGO:(null==i||i!==t)&&this.updateLogo();break;case tp.DISABLE_TRACKING:if(null==i||i!==t){let e=this.currentTime,t=this.paused;this.unload(),tm(this,ta,tr).call(this).then(()=>{this.currentTime=e,t||this.play()})}break;case tp.DISABLE_COOKIES:(null==i||i!==t)&&this.disableCookies&&document.cookie.split(";").forEach(e=>{e.trim().startsWith("muxData")&&(document.cookie=e.replace(/^ +/,"").replace(/=.*/,"=;expires="+new Date().toUTCString()+";path=/"))})}}updateLogo(){if(!this.shadowRoot)return;let e=this.shadowRoot.querySelector('slot[name="logo"]');e&&(e.innerHTML=this.constructor.getLogoHTML(tl(this,ti)||this.logo))}connectedCallback(){var e;null==(e=super.connectedCallback)||e.call(this),this.nativeEl&&this.src&&!tl(this,e3)&&tm(this,ta,tr).call(this)}disconnectedCallback(){this.unload()}handleEvent(e){e.target===this.nativeEl&&this.dispatchEvent(new CustomEvent(e.type,{composed:!0,detail:e.detail}))}};e3=new WeakMap,e4=new WeakMap,e5=new WeakMap,e9=new WeakMap,e8=new WeakMap,e6=new WeakMap,e7=new WeakMap,te=new WeakMap,tt=new WeakMap,ti=new WeakMap,ta=new WeakSet,tr=async function(){tl(this,e4)||(await tu(this,e4,Promise.resolve()),tu(this,e4,null),this.load())};var tg=e.i(861554);e.i(791205);var tf=e.i(7180),tA=e=>{throw TypeError(e)},ty=(e,t,i)=>t.has(e)||tA("Cannot "+i),tT=(e,t,i)=>(ty(e,t,"read from private field"),i?i.call(e):t.get(e)),tk=(e,t,i)=>t.has(e)?tA("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,i),t_=(e,t,i,a)=>(ty(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i),tw=class{addEventListener(){}removeEventListener(){}dispatchEvent(e){return!0}};"u"<typeof DocumentFragment&&(globalThis.DocumentFragment=class extends tw{});var tI,tR=class extends tw{},tC=class{constructor(e,t={}){tk(this,tI),t_(this,tI,null==t?void 0:t.detail)}get detail(){return tT(this,tI)}initCustomEvent(){}};tI=new WeakMap;var tS={document:{createElement:function(e,t){return new tR}},DocumentFragment,customElements:{get(e){},define(e,t,i){},getName:e=>null,upgrade(e){},whenDefined:e=>Promise.resolve(tR)},CustomEvent:tC,EventTarget:tw,HTMLElement:tR,HTMLVideoElement:class extends tw{}},tM="u"<typeof window||void 0===globalThis.customElements,tL=tM?tS:globalThis;tM&&tS.document;var tD,tx=class extends(0,tg.CastableMediaMixin)((0,tf.MediaTracksMixin)(tE)){constructor(){super(...arguments),tk(this,tD)}get autoplay(){let e=this.getAttribute("autoplay");return null!==e&&(""===e||e)}set autoplay(e){e!==this.autoplay&&(e?this.setAttribute("autoplay","string"==typeof e?e:""):this.removeAttribute("autoplay"))}get muxCastCustomData(){return{mux:{playbackId:this.playbackId,minResolution:this.minResolution,maxResolution:this.maxResolution,renditionOrder:this.renditionOrder,customDomain:this.customDomain,tokens:{drm:this.drmToken},envKey:this.envKey,metadata:this.metadata,disableCookies:this.disableCookies,disableTracking:this.disableTracking,beaconCollectionDomain:this.beaconCollectionDomain,startTime:this.startTime,preferCmcd:this.preferCmcd}}}get castCustomData(){var e;return null!=(e=tT(this,tD))?e:this.muxCastCustomData}set castCustomData(e){t_(this,tD,e)}};tD=new WeakMap,tL.customElements.get("mux-video")||(tL.customElements.define("mux-video",tx),tL.MuxVideoElement=tx);let tN={MEDIA_PLAY_REQUEST:"mediaplayrequest",MEDIA_PAUSE_REQUEST:"mediapauserequest",MEDIA_MUTE_REQUEST:"mediamuterequest",MEDIA_UNMUTE_REQUEST:"mediaunmuterequest",MEDIA_LOOP_REQUEST:"medialooprequest",MEDIA_VOLUME_REQUEST:"mediavolumerequest",MEDIA_SEEK_REQUEST:"mediaseekrequest",MEDIA_AIRPLAY_REQUEST:"mediaairplayrequest",MEDIA_ENTER_FULLSCREEN_REQUEST:"mediaenterfullscreenrequest",MEDIA_EXIT_FULLSCREEN_REQUEST:"mediaexitfullscreenrequest",MEDIA_PREVIEW_REQUEST:"mediapreviewrequest",MEDIA_ENTER_PIP_REQUEST:"mediaenterpiprequest",MEDIA_EXIT_PIP_REQUEST:"mediaexitpiprequest",MEDIA_ENTER_CAST_REQUEST:"mediaentercastrequest",MEDIA_EXIT_CAST_REQUEST:"mediaexitcastrequest",MEDIA_SHOW_TEXT_TRACKS_REQUEST:"mediashowtexttracksrequest",MEDIA_HIDE_TEXT_TRACKS_REQUEST:"mediahidetexttracksrequest",MEDIA_SHOW_SUBTITLES_REQUEST:"mediashowsubtitlesrequest",MEDIA_DISABLE_SUBTITLES_REQUEST:"mediadisablesubtitlesrequest",MEDIA_TOGGLE_SUBTITLES_REQUEST:"mediatogglesubtitlesrequest",MEDIA_PLAYBACK_RATE_REQUEST:"mediaplaybackraterequest",MEDIA_RENDITION_REQUEST:"mediarenditionrequest",MEDIA_AUDIO_TRACK_REQUEST:"mediaaudiotrackrequest",MEDIA_SEEK_TO_LIVE_REQUEST:"mediaseektoliverequest",REGISTER_MEDIA_STATE_RECEIVER:"registermediastatereceiver",UNREGISTER_MEDIA_STATE_RECEIVER:"unregistermediastatereceiver"},tO={MEDIA_CHROME_ATTRIBUTES:"mediachromeattributes",MEDIA_CONTROLLER:"mediacontroller"},tP={MEDIA_AIRPLAY_UNAVAILABLE:"mediaAirplayUnavailable",MEDIA_AUDIO_TRACK_ENABLED:"mediaAudioTrackEnabled",MEDIA_AUDIO_TRACK_LIST:"mediaAudioTrackList",MEDIA_AUDIO_TRACK_UNAVAILABLE:"mediaAudioTrackUnavailable",MEDIA_BUFFERED:"mediaBuffered",MEDIA_CAST_UNAVAILABLE:"mediaCastUnavailable",MEDIA_CHAPTERS_CUES:"mediaChaptersCues",MEDIA_CURRENT_TIME:"mediaCurrentTime",MEDIA_DURATION:"mediaDuration",MEDIA_ENDED:"mediaEnded",MEDIA_ERROR:"mediaError",MEDIA_ERROR_CODE:"mediaErrorCode",MEDIA_ERROR_MESSAGE:"mediaErrorMessage",MEDIA_FULLSCREEN_UNAVAILABLE:"mediaFullscreenUnavailable",MEDIA_HAS_PLAYED:"mediaHasPlayed",MEDIA_HEIGHT:"mediaHeight",MEDIA_IS_AIRPLAYING:"mediaIsAirplaying",MEDIA_IS_CASTING:"mediaIsCasting",MEDIA_IS_FULLSCREEN:"mediaIsFullscreen",MEDIA_IS_PIP:"mediaIsPip",MEDIA_LOADING:"mediaLoading",MEDIA_MUTED:"mediaMuted",MEDIA_LOOP:"mediaLoop",MEDIA_PAUSED:"mediaPaused",MEDIA_PIP_UNAVAILABLE:"mediaPipUnavailable",MEDIA_PLAYBACK_RATE:"mediaPlaybackRate",MEDIA_PREVIEW_CHAPTER:"mediaPreviewChapter",MEDIA_PREVIEW_COORDS:"mediaPreviewCoords",MEDIA_PREVIEW_IMAGE:"mediaPreviewImage",MEDIA_PREVIEW_TIME:"mediaPreviewTime",MEDIA_RENDITION_LIST:"mediaRenditionList",MEDIA_RENDITION_SELECTED:"mediaRenditionSelected",MEDIA_RENDITION_UNAVAILABLE:"mediaRenditionUnavailable",MEDIA_SEEKABLE:"mediaSeekable",MEDIA_STREAM_TYPE:"mediaStreamType",MEDIA_SUBTITLES_LIST:"mediaSubtitlesList",MEDIA_SUBTITLES_SHOWING:"mediaSubtitlesShowing",MEDIA_TARGET_LIVE_WINDOW:"mediaTargetLiveWindow",MEDIA_TIME_IS_LIVE:"mediaTimeIsLive",MEDIA_VOLUME:"mediaVolume",MEDIA_VOLUME_LEVEL:"mediaVolumeLevel",MEDIA_VOLUME_UNAVAILABLE:"mediaVolumeUnavailable",MEDIA_LANG:"mediaLang",MEDIA_WIDTH:"mediaWidth"},tU=Object.entries(tP),tW=tU.reduce((e,[t,i])=>(e[t]=i.toLowerCase(),e),{}),t$=tU.reduce((e,[t,i])=>(e[t]=i.toLowerCase(),e),{USER_INACTIVE_CHANGE:"userinactivechange",BREAKPOINTS_CHANGE:"breakpointchange",BREAKPOINTS_COMPUTED:"breakpointscomputed"}),tB=Object.entries(t$).reduce((e,[t,i])=>{let a=tW[t];return a&&(e[i]=a),e},{userinactivechange:"userinactive"}),tH=Object.entries(tW).reduce((e,[t,i])=>{let a=t$[t];return a&&(e[i]=a),e},{userinactive:"userinactivechange"}),tV={SUBTITLES:"subtitles",CAPTIONS:"captions",DESCRIPTIONS:"descriptions",CHAPTERS:"chapters",METADATA:"metadata"},tK={DISABLED:"disabled",HIDDEN:"hidden",SHOWING:"showing"},tF={HAVE_NOTHING:0,HAVE_METADATA:1,HAVE_CURRENT_DATA:2,HAVE_FUTURE_DATA:3,HAVE_ENOUGH_DATA:4},tY={MOUSE:"mouse",PEN:"pen",TOUCH:"touch"},tG={UNAVAILABLE:"unavailable",UNSUPPORTED:"unsupported"},tq={LIVE:"live",ON_DEMAND:"on-demand",UNKNOWN:"unknown"},tj={HIGH:"high",MEDIUM:"medium",LOW:"low",OFF:"off"},tZ={INLINE:"inline",FULLSCREEN:"fullscreen",PICTURE_IN_PICTURE:"picture-in-picture"};function tQ(e){if(e){let{id:t,width:i,height:a}=e;return[t,i,a].filter(e=>null!=e).join(":")}}function tz(e){if(e){let[t,i,a]=e.split(":");return{id:t,width:+i,height:+a}}}function tX(e){if(e){let{id:t,kind:i,language:a,label:r}=e;return[t,i,a,r].filter(e=>null!=e).join(":")}}function tJ(e){if(e){let[t,i,a,r]=e.split(":");return{id:t,kind:i,language:a,label:r}}}function t0(e){return"number"==typeof e&&!Number.isNaN(e)&&Number.isFinite(e)}function t1(e){return"string"==typeof e&&!isNaN(e)&&!isNaN(parseFloat(e))}e.s(["AttributeToStateChangeEventMap",()=>tH,"AvailabilityStates",()=>tG,"MediaStateChangeEvents",()=>t$,"MediaStateReceiverAttributes",()=>tO,"MediaUIAttributes",()=>tW,"MediaUIEvents",()=>tN,"MediaUIProps",()=>tP,"PointerTypes",()=>tY,"ReadyStates",()=>tF,"StateChangeEventToAttributeMap",()=>tB,"StreamTypes",()=>tq,"TextTrackKinds",()=>tV,"TextTrackModes",()=>tK,"VolumeLevels",()=>tj,"WebkitPresentationModes",()=>tZ],440798),e.i(440798);let t2=e=>new Promise(t=>setTimeout(t,e)),t3=[{singular:"hour",plural:"hours"},{singular:"minute",plural:"minutes"},{singular:"second",plural:"seconds"}],t4=e=>{if(!t0(e))return"";let t=Math.abs(e),i=t!==e,a=new Date(0,0,0,0,0,t,0),r=[a.getHours(),a.getMinutes(),a.getSeconds()].map((e,t)=>{let i;return e&&(i=1===e?t3[t].singular:t3[t].plural,`${e} ${i}`)}).filter(e=>e).join(", ");return`${r}${i?" remaining":""}`};function t5(e,t){let i=!1;e<0&&(i=!0,e=0-e);let a=Math.floor((e=e<0?0:e)%60),r=Math.floor(e/60%60),n=Math.floor(e/3600),s=Math.floor(t/60%60),o=Math.floor(t/3600);return(isNaN(e)||e===1/0)&&(n=r=a="0"),r=(((n=n>0||o>0?n+":":"")||s>=10)&&r<10?"0"+r:r)+":",(i?"-":"")+n+r+(a=a<10?"0"+a:a)}let t9=Object.freeze({length:0,start(e){let t=e>>>0;if(t>=this.length)throw new DOMException(`Failed to execute 'start' on 'TimeRanges': The index provided (${t}) is greater than or equal to the maximum bound (${this.length}).`);return 0},end(e){let t=e>>>0;if(t>=this.length)throw new DOMException(`Failed to execute 'end' on 'TimeRanges': The index provided (${t}) is greater than or equal to the maximum bound (${this.length}).`);return 0}});function t8(e=t9){return Array.from(e).map((t,i)=>[Number(e.start(i).toFixed(3)),Number(e.end(i).toFixed(3))].join(":")).join(" ")}e.s(["emptyTimeRanges",()=>t9,"formatAsTimePhrase",()=>t4,"formatTime",()=>t5,"serializeTimeRanges",()=>t8],436594),e.i(436594);let t6={en:{"Start airplay":"Start airplay","Stop airplay":"Stop airplay",Audio:"Audio",Captions:"Captions","Enable captions":"Enable captions","Disable captions":"Disable captions","Start casting":"Start casting","Stop casting":"Stop casting","Enter fullscreen mode":"Enter fullscreen mode","Exit fullscreen mode":"Exit fullscreen mode",Mute:"Mute",Unmute:"Unmute",Loop:"Loop","Enter picture in picture mode":"Enter picture in picture mode","Exit picture in picture mode":"Exit picture in picture mode",Play:"Play",Pause:"Pause","Playback rate":"Playback rate","Playback rate {playbackRate}":"Playback rate {playbackRate}",Quality:"Quality","Seek backward":"Seek backward","Seek forward":"Seek forward",Settings:"Settings",Auto:"Auto","audio player":"audio player","video player":"video player",volume:"volume",seek:"seek","closed captions":"closed captions","current playback rate":"current playback rate","playback time":"playback time","media loading":"media loading",settings:"settings","audio tracks":"audio tracks",quality:"quality",play:"play",pause:"pause",mute:"mute",unmute:"unmute","chapter: {chapterName}":"chapter: {chapterName}",live:"live",Off:"Off","start airplay":"start airplay","stop airplay":"stop airplay","start casting":"start casting","stop casting":"stop casting","enter fullscreen mode":"enter fullscreen mode","exit fullscreen mode":"exit fullscreen mode","enter picture in picture mode":"enter picture in picture mode","exit picture in picture mode":"exit picture in picture mode","seek to live":"seek to live","playing live":"playing live","seek back {seekOffset} seconds":"seek back {seekOffset} seconds","seek forward {seekOffset} seconds":"seek forward {seekOffset} seconds","Network Error":"Network Error","Decode Error":"Decode Error","Source Not Supported":"Source Not Supported","Encryption Error":"Encryption Error","A network error caused the media download to fail.":"A network error caused the media download to fail.","A media error caused playback to be aborted. The media could be corrupt or your browser does not support this format.":"A media error caused playback to be aborted. The media could be corrupt or your browser does not support this format.","An unsupported error occurred. The server or network failed, or your browser does not support this format.":"An unsupported error occurred. The server or network failed, or your browser does not support this format.","The media is encrypted and there are no keys to decrypt it.":"The media is encrypted and there are no keys to decrypt it."}},t7=(null==(oJ=globalThis.navigator)?void 0:oJ.language)||"en",ie=(e,t={})=>(e=>{var t,i,a;let[r]=t7.split("-");return(null==(t=t6[t7])?void 0:t[e])||(null==(i=t6[r])?void 0:i[e])||(null==(a=t6.en)?void 0:a[e])||e})(e).replace(/\{(\w+)\}/g,(e,i)=>i in t?String(t[i]):`{${i}}`);class it{addEventListener(){}removeEventListener(){}dispatchEvent(){return!0}}class ii extends it{}class ia extends ii{constructor(){super(...arguments),this.role=null}}let ir={createElement:function(){return new is.HTMLElement},createElementNS:function(){return new is.HTMLElement},addEventListener(){},removeEventListener(){},dispatchEvent:e=>!1},is={ResizeObserver:class{observe(){}unobserve(){}disconnect(){}},document:ir,Node:ii,Element:ia,HTMLElement:class extends ia{constructor(){super(...arguments),this.innerHTML=""}get content(){return new is.DocumentFragment}},DocumentFragment:class extends it{},customElements:{get:function(){},define:function(){},whenDefined:function(){}},localStorage:{getItem:e=>null,setItem(e,t){},removeItem(e){}},CustomEvent:function(){},getComputedStyle:function(){},navigator:{languages:[],get userAgent(){return""}},matchMedia:e=>({matches:!1,media:e}),DOMParser:class{parseFromString(e,t){return{body:{textContent:e}}}}},io="global"in globalThis&&(null==globalThis?void 0:globalThis.global)===globalThis||"u"<typeof window||void 0===window.customElements,il=Object.keys(is).every(e=>e in globalThis),id=io&&!il?is:globalThis,iu=io&&!il?ir:globalThis.document,im=new WeakMap,ih=e=>{let t=im.get(e);return t||im.set(e,t=new Set),t},ic=new id.ResizeObserver(e=>{for(let t of e)for(let e of ih(t.target))e(t)});function ip(e,t){ih(e).add(t),ic.observe(e)}function iv(e,t){let i=ih(e);i.delete(t),i.size||ic.unobserve(e)}function ib(e){let t={};for(let i of e)t[i.name]=i.value;return t}function iE(e){var t;return null!=(t=ig(e))?t:ik(e,"media-controller")}function ig(e){var t;let{MEDIA_CONTROLLER:i}=tO,a=e.getAttribute(i);if(a)return null==(t=iw(e))?void 0:t.getElementById(a)}let iA=(e,t,i=".value")=>{let a=e.querySelector(i);a&&(a.textContent=t)},iy=(e,t)=>{let i,a;return(i=`slot[name="${t}"]`,!(a=e.shadowRoot.querySelector(i))?[]:a.children)[0]},iT=(e,t)=>!!e&&!!t&&(null!=e&&!!e.contains(t)||iT(e,t.getRootNode().host)),ik=(e,t)=>{if(!e)return null;let i=e.closest(t);return i||ik(e.getRootNode().host,t)};function i_(e=document){var t;let i=null==e?void 0:e.activeElement;return i?null!=(t=i_(i.shadowRoot))?t:i:null}function iw(e){var t;let i=null==(t=null==e?void 0:e.getRootNode)?void 0:t.call(e);return i instanceof ShadowRoot||i instanceof Document?i:null}function iI(e,{depth:t=3,checkOpacity:i=!0,checkVisibilityCSS:a=!0}={}){if(e.checkVisibility)return e.checkVisibility({checkOpacity:i,checkVisibilityCSS:a});let r=e;for(;r&&t>0;){let e=getComputedStyle(r);if(i&&"0"===e.opacity||a&&"hidden"===e.visibility||"none"===e.display)return!1;r=r.parentElement,t--}return!0}function iR(e,t){let i=function(e,t){var i,a;let r;for(r of null!=(i=e.querySelectorAll("style:not([media])"))?i:[]){let e;try{e=null==(a=r.sheet)?void 0:a.cssRules}catch{continue}for(let i of null!=e?e:[])if(t(i.selectorText))return i}}(e,e=>e===t);return i||iC(e,t)}function iC(e,t){var i,a;let r=null!=(i=e.querySelectorAll("style:not([media])"))?i:[],n=null==r?void 0:r[r.length-1];return(null==n?void 0:n.sheet)?(null==n||n.sheet.insertRule(`${t}{}`,n.sheet.cssRules.length),null==(a=n.sheet.cssRules)?void 0:a[n.sheet.cssRules.length-1]):(console.warn("Media Chrome: No style sheet found on style tag of",e),{style:{setProperty:()=>{},removeProperty:()=>"",getPropertyValue:()=>""}})}function iS(e,t,i=NaN){let a=e.getAttribute(t);return null!=a?+a:i}function iM(e,t,i){let a=+i;if(null==i||Number.isNaN(a)){e.hasAttribute(t)&&e.removeAttribute(t);return}iS(e,t,void 0)!==a&&e.setAttribute(t,`${a}`)}function iL(e,t){return e.hasAttribute(t)}function iD(e,t,i){if(null==i){e.hasAttribute(t)&&e.removeAttribute(t);return}iL(e,t)!=i&&e.toggleAttribute(t,i)}function ix(e,t,i=null){var a;return null!=(a=e.getAttribute(t))?a:i}function iN(e,t,i){if(null==i){e.hasAttribute(t)&&e.removeAttribute(t);return}let a=`${i}`;ix(e,t,void 0)!==a&&e.setAttribute(t,a)}var iO=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},iP=(e,t,i)=>(iO(e,t,"read from private field"),i?i.call(e):t.get(e)),iU=(e,t,i,a)=>(iO(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i);class iW extends id.HTMLElement{constructor(){if(super(),((e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)})(this,o0,void 0),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);const e=ib(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e)}}static get observedAttributes(){return[tO.MEDIA_CONTROLLER,tW.MEDIA_PAUSED]}attributeChangedCallback(e,t,i){var a,r,n,s,o;e===tO.MEDIA_CONTROLLER&&(t&&(null==(r=null==(a=iP(this,o0))?void 0:a.unassociateElement)||r.call(a,this),iU(this,o0,null)),i&&this.isConnected&&(iU(this,o0,null==(n=this.getRootNode())?void 0:n.getElementById(i)),null==(o=null==(s=iP(this,o0))?void 0:s.associateElement)||o.call(s,this)))}connectedCallback(){var e,t,i,a,r,n;let s;this.tabIndex=-1,this.setAttribute("aria-hidden","true"),iU(this,o0,(r=this,(s=r.getAttribute(tO.MEDIA_CONTROLLER))?null==(n=r.getRootNode())?void 0:n.getElementById(s):ik(r,"media-controller"))),this.getAttribute(tO.MEDIA_CONTROLLER)&&(null==(t=null==(e=iP(this,o0))?void 0:e.associateElement)||t.call(e,this)),null==(i=iP(this,o0))||i.addEventListener("pointerdown",this),null==(a=iP(this,o0))||a.addEventListener("click",this)}disconnectedCallback(){var e,t,i,a;this.getAttribute(tO.MEDIA_CONTROLLER)&&(null==(t=null==(e=iP(this,o0))?void 0:e.unassociateElement)||t.call(e,this)),null==(i=iP(this,o0))||i.removeEventListener("pointerdown",this),null==(a=iP(this,o0))||a.removeEventListener("click",this),iU(this,o0,null)}handleEvent(e){var t;let i=null==(t=e.composedPath())?void 0:t[0];if(["video","media-controller"].includes(null==i?void 0:i.localName)){if("pointerdown"===e.type)this._pointerType=e.pointerType;else if("click"===e.type){let{clientX:t,clientY:i}=e,{left:a,top:r,width:n,height:s}=this.getBoundingClientRect(),o=t-a,l=i-r;if(o<0||l<0||o>n||l>s||0===n&&0===s)return;let d=this._pointerType||"mouse";if(this._pointerType=void 0,d===tY.TOUCH)return void this.handleTap(e);if(d===tY.MOUSE||d===tY.PEN)return void this.handleMouseClick(e)}}}get mediaPaused(){return iL(this,tW.MEDIA_PAUSED)}set mediaPaused(e){iD(this,tW.MEDIA_PAUSED,e)}handleTap(e){}handleMouseClick(e){let t=this.mediaPaused?tN.MEDIA_PLAY_REQUEST:tN.MEDIA_PAUSE_REQUEST;this.dispatchEvent(new id.CustomEvent(t,{composed:!0,bubbles:!0}))}}o0=new WeakMap,iW.shadowRootOptions={mode:"open"},iW.getTemplateHTML=function(e){return`
    <style>
      :host {
        display: var(--media-control-display, var(--media-gesture-receiver-display, inline-block));
        box-sizing: border-box;
      }
    </style>
  `},id.customElements.get("media-gesture-receiver")||id.customElements.define("media-gesture-receiver",iW);var i$=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},iB=(e,t,i)=>(i$(e,t,"read from private field"),i?i.call(e):t.get(e)),iH=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},iV=(e,t,i,a)=>(i$(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i),iK=(e,t,i)=>(i$(e,t,"access private method"),i);let iF="audio",iY="autohide",iG="breakpoints",iq="gesturesdisabled",ij="keyboardcontrol",iZ="noautohide",iQ="userinactive",iz="autohideovercontrols",iX=Object.values(tW);function iJ(e,t){var i,a,r;if(!e.isConnected)return;let n=Object.fromEntries((null!=(i=e.getAttribute(iG))?i:"sm:384 md:576 lg:768 xl:960").split(/\s+/).map(e=>e.split(":"))),s=(a=n,r=t,Object.keys(a).filter(e=>r>=parseInt(a[e]))),o=!1;if(Object.keys(n).forEach(t=>{if(s.includes(t)){e.hasAttribute(`breakpoint${t}`)||(e.setAttribute(`breakpoint${t}`,""),o=!0);return}e.hasAttribute(`breakpoint${t}`)&&(e.removeAttribute(`breakpoint${t}`),o=!0)}),o){let t=new CustomEvent(t$.BREAKPOINTS_CHANGE,{detail:s});e.dispatchEvent(t)}e.breakpointsComputed||(e.breakpointsComputed=!0,e.dispatchEvent(new CustomEvent(t$.BREAKPOINTS_COMPUTED,{bubbles:!0,composed:!0})))}class i0 extends id.HTMLElement{constructor(){if(super(),iH(this,o9),iH(this,le),iH(this,li),iH(this,lr),iH(this,ls),iH(this,ll),iH(this,o1,0),iH(this,o2,null),iH(this,o3,null),iH(this,o4,void 0),this.breakpointsComputed=!1,iH(this,o5,new MutationObserver(iK(this,o9,o8).bind(this))),iH(this,o6,!1),iH(this,o7,e=>{iB(this,o6)||(setTimeout(()=>{iJ(e.target,e.contentRect.width),iV(this,o6,!1)},0),iV(this,o6,!0))}),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);const e=ib(this.attributes),t=this.constructor.getTemplateHTML(e);this.shadowRoot.setHTMLUnsafe?this.shadowRoot.setHTMLUnsafe(t):this.shadowRoot.innerHTML=t}const e=this.querySelector(":scope > slot[slot=media]");e&&e.addEventListener("slotchange",()=>{if(!e.assignedElements({flatten:!0}).length){iB(this,o2)&&this.mediaUnsetCallback(iB(this,o2));return}this.handleMediaUpdated(this.media)})}static get observedAttributes(){return[iY,iq].concat(iX).filter(e=>![tW.MEDIA_RENDITION_LIST,tW.MEDIA_AUDIO_TRACK_LIST,tW.MEDIA_CHAPTERS_CUES,tW.MEDIA_WIDTH,tW.MEDIA_HEIGHT,tW.MEDIA_ERROR,tW.MEDIA_ERROR_MESSAGE].includes(e))}attributeChangedCallback(e,t,i){e.toLowerCase()==iY&&(this.autohide=i)}get media(){let e=this.querySelector(":scope > [slot=media]");return(null==e?void 0:e.nodeName)=="SLOT"&&(e=e.assignedElements({flatten:!0})[0]),e}async handleMediaUpdated(e){e&&(iV(this,o2,e),e.localName.includes("-")&&await id.customElements.whenDefined(e.localName),this.mediaSetCallback(e))}connectedCallback(){var e;iB(this,o5).observe(this,{childList:!0,subtree:!0}),ip(this,iB(this,o7));let t=null!=this.getAttribute(iF)?ie("audio player"):ie("video player");this.setAttribute("role","region"),this.setAttribute("aria-label",t),this.handleMediaUpdated(this.media),this.setAttribute(iQ,""),iJ(this,this.getBoundingClientRect().width),this.addEventListener("pointerdown",this),this.addEventListener("pointermove",this),this.addEventListener("pointerup",this),this.addEventListener("mouseleave",this),this.addEventListener("keyup",this),null==(e=id.window)||e.addEventListener("mouseup",this)}disconnectedCallback(){var e;iB(this,o5).disconnect(),iv(this,iB(this,o7)),this.media&&this.mediaUnsetCallback(this.media),null==(e=id.window)||e.removeEventListener("mouseup",this)}mediaSetCallback(e){}mediaUnsetCallback(e){iV(this,o2,null)}handleEvent(e){switch(e.type){case"pointerdown":iV(this,o1,e.timeStamp);break;case"pointermove":iK(this,le,lt).call(this,e);break;case"pointerup":iK(this,li,la).call(this,e);break;case"mouseleave":iK(this,lr,ln).call(this);break;case"mouseup":this.removeAttribute(ij);break;case"keyup":iK(this,ll,ld).call(this),this.setAttribute(ij,"")}}set autohide(e){let t=Number(e);iV(this,o4,isNaN(t)?0:t)}get autohide(){return(void 0===iB(this,o4)?2:iB(this,o4)).toString()}get breakpoints(){return ix(this,iG)}set breakpoints(e){iN(this,iG,e)}get audio(){return iL(this,iF)}set audio(e){iD(this,iF,e)}get gesturesDisabled(){return iL(this,iq)}set gesturesDisabled(e){iD(this,iq,e)}get keyboardControl(){return iL(this,ij)}set keyboardControl(e){iD(this,ij,e)}get noAutohide(){return iL(this,iZ)}set noAutohide(e){iD(this,iZ,e)}get autohideOverControls(){return iL(this,iz)}set autohideOverControls(e){iD(this,iz,e)}get userInteractive(){return iL(this,iQ)}set userInteractive(e){iD(this,iQ,e)}}o1=new WeakMap,o2=new WeakMap,o3=new WeakMap,o4=new WeakMap,o5=new WeakMap,o9=new WeakSet,o8=function(e){let t=this.media;for(let i of e)if("childList"===i.type){for(let e of i.removedNodes){if("media"!=e.slot||i.target!=this)continue;let a=i.previousSibling&&i.previousSibling.previousElementSibling;if(a&&t){let t="media"!==a.slot;for(;null!==(a=a.previousSibling);)"media"==a.slot&&(t=!1);t&&this.mediaUnsetCallback(e)}else this.mediaUnsetCallback(e)}if(t)for(let e of i.addedNodes)e===t&&this.handleMediaUpdated(t)}},o6=new WeakMap,o7=new WeakMap,le=new WeakSet,lt=function(e){if("mouse"!==e.pointerType&&e.timeStamp-iB(this,o1)<250)return;iK(this,ls,lo).call(this),clearTimeout(iB(this,o3));let t=this.hasAttribute(iz);([this,this.media].includes(e.target)||t)&&iK(this,ll,ld).call(this)},li=new WeakSet,la=function(e){if("touch"===e.pointerType){let t=!this.hasAttribute(iQ);[this,this.media].includes(e.target)&&t?iK(this,lr,ln).call(this):iK(this,ll,ld).call(this)}else e.composedPath().some(e=>["media-play-button","media-fullscreen-button"].includes(null==e?void 0:e.localName))&&iK(this,ll,ld).call(this)},lr=new WeakSet,ln=function(){if(0>iB(this,o4)||this.hasAttribute(iQ))return;this.setAttribute(iQ,"");let e=new id.CustomEvent(t$.USER_INACTIVE_CHANGE,{composed:!0,bubbles:!0,detail:!0});this.dispatchEvent(e)},ls=new WeakSet,lo=function(){if(!this.hasAttribute(iQ))return;this.removeAttribute(iQ);let e=new id.CustomEvent(t$.USER_INACTIVE_CHANGE,{composed:!0,bubbles:!0,detail:!1});this.dispatchEvent(e)},ll=new WeakSet,ld=function(){iK(this,ls,lo).call(this),clearTimeout(iB(this,o3));let e=parseInt(this.autohide);e<0||iV(this,o3,setTimeout(()=>{iK(this,lr,ln).call(this)},1e3*e))},i0.shadowRootOptions={mode:"open"},i0.getTemplateHTML=function(e){return`
    <style>
      
      :host([${tW.MEDIA_IS_FULLSCREEN}]) ::slotted([slot=media]) {
        outline: none;
      }

      :host {
        box-sizing: border-box;
        position: relative;
        display: inline-block;
        line-height: 0;
        background-color: var(--media-background-color, #000);
        overflow: hidden;
      }

      :host(:not([${iF}])) [part~=layer]:not([part~=media-layer]) {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        display: flex;
        flex-flow: column nowrap;
        align-items: start;
        pointer-events: none;
        background: none;
      }

      slot[name=media] {
        display: var(--media-slot-display, contents);
      }

      
      :host([${iF}]) slot[name=media] {
        display: var(--media-slot-display, none);
      }

      
      :host([${iF}]) [part~=layer][part~=gesture-layer] {
        height: 0;
        display: block;
      }

      
      :host(:not([${iF}])[${iq}]) ::slotted([slot=gestures-chrome]),
          :host(:not([${iF}])[${iq}]) media-gesture-receiver[slot=gestures-chrome] {
        display: none;
      }

      
      ::slotted(:not([slot=media]):not([slot=poster]):not(media-loading-indicator):not([role=dialog]):not([hidden])) {
        pointer-events: auto;
      }

      :host(:not([${iF}])) *[part~=layer][part~=centered-layer] {
        align-items: center;
        justify-content: center;
      }

      :host(:not([${iF}])) ::slotted(media-gesture-receiver[slot=gestures-chrome]),
      :host(:not([${iF}])) media-gesture-receiver[slot=gestures-chrome] {
        align-self: stretch;
        flex-grow: 1;
      }

      slot[name=middle-chrome] {
        display: inline;
        flex-grow: 1;
        pointer-events: none;
        background: none;
      }

      
      ::slotted([slot=media]),
      ::slotted([slot=poster]) {
        width: 100%;
        height: 100%;
      }

      
      :host(:not([${iF}])) .spacer {
        flex-grow: 1;
      }

      
      :host(:-webkit-full-screen) {
        
        width: 100% !important;
        height: 100% !important;
      }

      
      ::slotted(:not([slot=media]):not([slot=poster]):not([${iZ}]):not([hidden]):not([role=dialog])) {
        opacity: 1;
        transition: var(--media-control-transition-in, opacity 0.25s);
      }

      
      :host([${iQ}]:not([${tW.MEDIA_PAUSED}]):not([${tW.MEDIA_IS_AIRPLAYING}]):not([${tW.MEDIA_IS_CASTING}]):not([${iF}])) ::slotted(:not([slot=media]):not([slot=poster]):not([${iZ}]):not([role=dialog])) {
        opacity: 0;
        transition: var(--media-control-transition-out, opacity 1s);
      }

      :host([${iQ}]:not([${iZ}]):not([${tW.MEDIA_PAUSED}]):not([${tW.MEDIA_IS_CASTING}]):not([${iF}])) ::slotted([slot=media]) {
        cursor: none;
      }

      :host([${iQ}][${iz}]:not([${iZ}]):not([${tW.MEDIA_PAUSED}]):not([${tW.MEDIA_IS_CASTING}]):not([${iF}])) * {
        --media-cursor: none;
        cursor: none;
      }


      ::slotted(media-control-bar)  {
        align-self: stretch;
      }

      
      :host(:not([${iF}])[${tW.MEDIA_HAS_PLAYED}]) slot[name=poster] {
        display: none;
      }

      ::slotted([role=dialog]) {
        width: 100%;
        height: 100%;
        align-self: center;
      }

      ::slotted([role=menu]) {
        align-self: end;
      }
    </style>

    <slot name="media" part="layer media-layer"></slot>
    <slot name="poster" part="layer poster-layer"></slot>
    <slot name="gestures-chrome" part="layer gesture-layer">
      <media-gesture-receiver slot="gestures-chrome">
        <template shadowrootmode="${iW.shadowRootOptions.mode}">
          ${iW.getTemplateHTML({})}
        </template>
      </media-gesture-receiver>
    </slot>
    <span part="layer vertical-layer">
      <slot name="top-chrome" part="top chrome"></slot>
      <slot name="middle-chrome" part="middle chrome"></slot>
      <slot name="centered-chrome" part="layer centered-layer center centered chrome"></slot>
      
      <slot part="bottom chrome"></slot>
    </span>
    <slot name="dialog" part="layer dialog-layer"></slot>
  `},id.customElements.get("media-container")||id.customElements.define("media-container",i0);var i1=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},i2=(e,t,i)=>(i1(e,t,"read from private field"),i?i.call(e):t.get(e)),i3=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},i4=(e,t,i,a)=>(i1(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i);class i5{constructor(e,t,{defaultValue:i}={defaultValue:void 0}){i3(this,lp),i3(this,lu,void 0),i3(this,lm,void 0),i3(this,lh,void 0),i3(this,lc,new Set),i4(this,lu,e),i4(this,lm,t),i4(this,lh,new Set(i))}[Symbol.iterator](){return i2(this,lp,lv).values()}get length(){return i2(this,lp,lv).size}get value(){var e;return null!=(e=[...i2(this,lp,lv)].join(" "))?e:""}set value(e){var t;e!==this.value&&(i4(this,lc,new Set),this.add(...null!=(t=null==e?void 0:e.split(" "))?t:[]))}toString(){return this.value}item(e){return[...i2(this,lp,lv)][e]}values(){return i2(this,lp,lv).values()}forEach(e,t){i2(this,lp,lv).forEach(e,t)}add(...e){var t,i;e.forEach(e=>i2(this,lc).add(e)),(""!==this.value||(null==(t=i2(this,lu))?void 0:t.hasAttribute(`${i2(this,lm)}`)))&&(null==(i=i2(this,lu))||i.setAttribute(`${i2(this,lm)}`,`${this.value}`))}remove(...e){var t;e.forEach(e=>i2(this,lc).delete(e)),null==(t=i2(this,lu))||t.setAttribute(`${i2(this,lm)}`,`${this.value}`)}contains(e){return i2(this,lp,lv).has(e)}toggle(e,t){if(void 0!==t)if(t)return this.add(e),!0;else return this.remove(e),!1;return this.contains(e)?(this.remove(e),!1):(this.add(e),!0)}replace(e,t){return this.remove(e),this.add(t),e===t}}lu=new WeakMap,lm=new WeakMap,lh=new WeakMap,lc=new WeakMap,lp=new WeakSet,lv=function(){return i2(this,lc).size?i2(this,lc):i2(this,lh)};let i9=(e="")=>{let[t,i,a]=e.split(":"),r=a?decodeURIComponent(a):void 0;return{kind:"cc"===t?tV.CAPTIONS:tV.SUBTITLES,language:i,label:r}},i8=(e="",t={})=>((e="")=>e.split(/\s+/))(e).map(e=>{let i=i9(e);return{...t,...i}}),i6=e=>e?Array.isArray(e)?e.map(e=>"string"==typeof e?i9(e):e):"string"==typeof e?i8(e):[e]:[],i7=({kind:e,label:t,language:i}={kind:"subtitles"})=>t?`${"captions"===e?"cc":"sb"}:${i}:${encodeURIComponent(t)}`:i,ae=(e=[])=>Array.prototype.map.call(e,i7).join(" "),at=e=>{let t=Object.entries(e).map(([e,t])=>i=>i[e]===t);return e=>t.every(t=>t(e))},ai=(e,t=[],i=[])=>{let a=i6(i).map(at);Array.from(t).filter(e=>a.some(t=>t(e))).forEach(t=>{t.mode=e})},aa=(e,t=()=>!0)=>{if(!(null==e?void 0:e.textTracks))return[];let i="function"==typeof t?t:at(t);return Array.from(e.textTracks).filter(i)},ar=e=>{var t;return!!(null==(t=e.mediaSubtitlesShowing)?void 0:t.length)||e.hasAttribute(tW.MEDIA_SUBTITLES_SHOWING)},an="exitFullscreen"in iu?"exitFullscreen":"webkitExitFullscreen"in iu?"webkitExitFullscreen":"webkitCancelFullScreen"in iu?"webkitCancelFullScreen":void 0,as="fullscreenElement"in iu?"fullscreenElement":"webkitFullscreenElement"in iu?"webkitFullscreenElement":void 0,ao="fullscreenEnabled"in iu?"fullscreenEnabled":"webkitFullscreenEnabled"in iu?"webkitFullscreenEnabled":void 0,al=()=>{var e;return t||(t=null==(e=null==iu?void 0:iu.createElement)?void 0:e.call(iu,"video"))},ad=async(e=al())=>{if(!e)return!1;let t=e.volume;e.volume=t/2+.1;let i=new AbortController,a=await Promise.race([au(e,i.signal),am(e,t)]);return i.abort(),a},au=(e,t)=>new Promise(i=>{e.addEventListener("volumechange",()=>i(!0),{signal:t})}),am=async(e,t)=>{for(let i=0;i<10;i++){if(e.volume===t)return!1;await t2(10)}return e.volume!==t},ah=/.*Version\/.*Safari\/.*/.test(id.navigator.userAgent),ac=(e=al())=>(!id.matchMedia("(display-mode: standalone)").matches||!ah)&&"function"==typeof(null==e?void 0:e.requestPictureInPicture),ap=(e=al())=>(e=>{let{documentElement:t,media:i}=e;return!!(null==t?void 0:t[ao])||i&&"webkitSupportsFullscreen"in i})({documentElement:iu,media:e}),av=ap(),ab=ac(),aE=!!id.WebKitPlaybackTargetAvailabilityEvent,ag=!!id.chrome,af=e=>aa(e.media,e=>[tV.SUBTITLES,tV.CAPTIONS].includes(e.kind)).sort((e,t)=>e.kind>=t.kind?1:-1),aA=e=>aa(e.media,e=>e.mode===tK.SHOWING&&[tV.SUBTITLES,tV.CAPTIONS].includes(e.kind)),ay=(e,t)=>{let i=af(e),a=aA(e),r=!!a.length;if(i.length){if(!1===t||r&&!0!==t)ai(tK.DISABLED,i,a);else if(!0===t||!r&&!1!==t){let t=i[0],{options:r}=e;if(!(null==r?void 0:r.noSubtitlesLangPref)){let e=globalThis.localStorage.getItem("media-chrome-pref-subtitles-lang"),a=e?[e,...globalThis.navigator.languages]:globalThis.navigator.languages,r=i.filter(e=>a.some(t=>e.language.toLowerCase().startsWith(t.split("-")[0]))).sort((e,t)=>a.findIndex(t=>e.language.toLowerCase().startsWith(t.split("-")[0]))-a.findIndex(e=>t.language.toLowerCase().startsWith(e.split("-")[0])));r[0]&&(t=r[0])}let{language:n,label:s,kind:o}=t;ai(tK.DISABLED,i,a),ai(tK.SHOWING,i,[{language:n,label:s,kind:o}])}}},aT=(e,t)=>e===t||null!=e&&null!=t&&typeof e==typeof t&&(!!("number"==typeof e&&Number.isNaN(e)&&Number.isNaN(t))||"object"==typeof e&&(Array.isArray(e)?ak(e,t):Object.entries(e).every(([e,i])=>e in t&&aT(i,t[e])))),ak=(e,t)=>{let i=Array.isArray(e),a=Array.isArray(t);return i===a&&(!i&&!a||e.length===t.length&&e.every((e,i)=>aT(e,t[i])))},a_=Object.values(tq),aw=ad().then(e=>i=e),aI=async(...e)=>{await Promise.all(e.filter(e=>e).map(async e=>{if(!("localName"in e&&e instanceof id.HTMLElement))return;let t=e.localName;if(!t.includes("-"))return;let i=id.customElements.get(t);i&&e instanceof i||(await id.customElements.whenDefined(t),id.customElements.upgrade(e))}))},aR=new id.DOMParser,aC={mediaError:{get(e,t){let{media:i}=e;if((null==t?void 0:t.type)!=="playing")return null==i?void 0:i.error},mediaEvents:["emptied","error","playing"]},mediaErrorCode:{get(e,t){var i;let{media:a}=e;if((null==t?void 0:t.type)!=="playing")return null==(i=null==a?void 0:a.error)?void 0:i.code},mediaEvents:["emptied","error","playing"]},mediaErrorMessage:{get(e,t){var i,a;let{media:r}=e;if((null==t?void 0:t.type)!=="playing")return null!=(a=null==(i=null==r?void 0:r.error)?void 0:i.message)?a:""},mediaEvents:["emptied","error","playing"]},mediaWidth:{get(e){var t;let{media:i}=e;return null!=(t=null==i?void 0:i.videoWidth)?t:0},mediaEvents:["resize"]},mediaHeight:{get(e){var t;let{media:i}=e;return null!=(t=null==i?void 0:i.videoHeight)?t:0},mediaEvents:["resize"]},mediaPaused:{get(e){var t;let{media:i}=e;return null==(t=null==i?void 0:i.paused)||t},set(e,t){var i;let{media:a}=t;a&&(e?a.pause():null==(i=a.play())||i.catch(()=>{}))},mediaEvents:["play","playing","pause","emptied"]},mediaHasPlayed:{get(e,t){let{media:i}=e;return!!i&&(t?"playing"===t.type:!i.paused)},mediaEvents:["playing","emptied"]},mediaEnded:{get(e){var t;let{media:i}=e;return null!=(t=null==i?void 0:i.ended)&&t},mediaEvents:["seeked","ended","emptied"]},mediaPlaybackRate:{get(e){var t;let{media:i}=e;return null!=(t=null==i?void 0:i.playbackRate)?t:1},set(e,t){let{media:i}=t;!i||Number.isFinite(+e)&&(i.playbackRate=+e)},mediaEvents:["ratechange","loadstart"]},mediaMuted:{get(e){var t;let{media:i}=e;return null!=(t=null==i?void 0:i.muted)&&t},set(e,t){let{media:i,options:{noMutedPref:a}={}}=t;if(i){i.muted=e;try{let t=null!==id.localStorage.getItem("media-chrome-pref-muted"),r=i.hasAttribute("muted");if(a){t&&id.localStorage.removeItem("media-chrome-pref-muted");return}if(r&&!t)return;id.localStorage.setItem("media-chrome-pref-muted",e?"true":"false")}catch(e){console.debug("Error setting muted pref",e)}}},mediaEvents:["volumechange"],stateOwnersUpdateHandlers:[(e,t)=>{let{options:{noMutedPref:i}}=t,{media:a}=t;if(a&&!a.muted&&!i)try{let i="true"===id.localStorage.getItem("media-chrome-pref-muted");aC.mediaMuted.set(i,t),e(i)}catch(e){console.debug("Error getting muted pref",e)}}]},mediaLoop:{get(e){let{media:t}=e;return null==t?void 0:t.loop},set(e,t){let{media:i}=t;i&&(i.loop=e)},mediaEvents:["medialooprequest"]},mediaVolume:{get(e){var t;let{media:i}=e;return null!=(t=null==i?void 0:i.volume)?t:1},set(e,t){let{media:i,options:{noVolumePref:a}={}}=t;if(i){try{null==e?id.localStorage.removeItem("media-chrome-pref-volume"):i.hasAttribute("muted")||a||id.localStorage.setItem("media-chrome-pref-volume",e.toString())}catch(e){console.debug("Error setting volume pref",e)}Number.isFinite(+e)&&(i.volume=+e)}},mediaEvents:["volumechange"],stateOwnersUpdateHandlers:[(e,t)=>{let{options:{noVolumePref:i}}=t;if(!i)try{let{media:i}=t;if(!i)return;let a=id.localStorage.getItem("media-chrome-pref-volume");if(null==a)return;aC.mediaVolume.set(+a,t),e(+a)}catch(e){console.debug("Error getting volume pref",e)}}]},mediaVolumeLevel:{get(e){let{media:t}=e;return void 0===(null==t?void 0:t.volume)?"high":t.muted||0===t.volume?"off":t.volume<.5?"low":t.volume<.75?"medium":"high"},mediaEvents:["volumechange"]},mediaCurrentTime:{get(e){var t;let{media:i}=e;return null!=(t=null==i?void 0:i.currentTime)?t:0},set(e,t){let{media:i}=t;i&&t0(e)&&(i.currentTime=e)},mediaEvents:["timeupdate","loadedmetadata"]},mediaDuration:{get(e){let{media:t,options:{defaultDuration:i}={}}=e;return i&&(!t||!t.duration||Number.isNaN(t.duration)||!Number.isFinite(t.duration))?i:Number.isFinite(null==t?void 0:t.duration)?t.duration:NaN},mediaEvents:["durationchange","loadedmetadata","emptied"]},mediaLoading:{get(e){let{media:t}=e;return(null==t?void 0:t.readyState)<3},mediaEvents:["waiting","playing","emptied"]},mediaSeekable:{get(e){var t;let{media:i}=e;if(!(null==(t=null==i?void 0:i.seekable)?void 0:t.length))return;let a=i.seekable.start(0),r=i.seekable.end(i.seekable.length-1);if(a||r)return[Number(a.toFixed(3)),Number(r.toFixed(3))]},mediaEvents:["loadedmetadata","emptied","progress","seekablechange"]},mediaBuffered:{get(e){var t;let{media:i}=e,a=null!=(t=null==i?void 0:i.buffered)?t:[];return Array.from(a).map((e,t)=>[Number(a.start(t).toFixed(3)),Number(a.end(t).toFixed(3))])},mediaEvents:["progress","emptied"]},mediaStreamType:{get(e){let{media:t,options:{defaultStreamType:i}={}}=e,a=[tq.LIVE,tq.ON_DEMAND].includes(i)?i:void 0;if(!t)return a;let{streamType:r}=t;if(a_.includes(r))return r===tq.UNKNOWN?a:r;let n=t.duration;return n===1/0?tq.LIVE:Number.isFinite(n)?tq.ON_DEMAND:a},mediaEvents:["emptied","durationchange","loadedmetadata","streamtypechange"]},mediaTargetLiveWindow:{get(e){let{media:t}=e;if(!t)return NaN;let{targetLiveWindow:i}=t,a=aC.mediaStreamType.get(e);return(null==i||Number.isNaN(i))&&a===tq.LIVE?0:i},mediaEvents:["emptied","durationchange","loadedmetadata","streamtypechange","targetlivewindowchange"]},mediaTimeIsLive:{get(e){let{media:t,options:{liveEdgeOffset:i=10}={}}=e;if(!t)return!1;if("number"==typeof t.liveEdgeStart)return!Number.isNaN(t.liveEdgeStart)&&t.currentTime>=t.liveEdgeStart;if(aC.mediaStreamType.get(e)!==tq.LIVE)return!1;let a=t.seekable;if(!a)return!0;if(!a.length)return!1;let r=a.end(a.length-1)-i;return t.currentTime>=r},mediaEvents:["playing","timeupdate","progress","waiting","emptied"]},mediaSubtitlesList:{get:e=>af(e).map(({kind:e,label:t,language:i})=>({kind:e,label:t,language:i})),mediaEvents:["loadstart"],textTracksEvents:["addtrack","removetrack"]},mediaSubtitlesShowing:{get:e=>aA(e).map(({kind:e,label:t,language:i})=>({kind:e,label:t,language:i})),mediaEvents:["loadstart"],textTracksEvents:["addtrack","removetrack","change"],stateOwnersUpdateHandlers:[(e,t)=>{var i,a;let{media:r,options:n}=t;if(!r)return;let s=e=>{var i;n.defaultSubtitles&&(e&&![tV.CAPTIONS,tV.SUBTITLES].includes(null==(i=null==e?void 0:e.track)?void 0:i.kind)||ay(t,!0))};return r.addEventListener("loadstart",s),null==(i=r.textTracks)||i.addEventListener("addtrack",s),null==(a=r.textTracks)||a.addEventListener("removetrack",s),()=>{var e,t;r.removeEventListener("loadstart",s),null==(e=r.textTracks)||e.removeEventListener("addtrack",s),null==(t=r.textTracks)||t.removeEventListener("removetrack",s)}}]},mediaChaptersCues:{get(e){var t;let{media:i}=e;if(!i)return[];let[a]=aa(i,{kind:tV.CHAPTERS});return Array.from(null!=(t=null==a?void 0:a.cues)?t:[]).map(({text:e,startTime:t,endTime:i})=>({text:e&&aR.parseFromString(e,"text/html").body.textContent||e,startTime:t,endTime:i}))},mediaEvents:["loadstart","loadedmetadata"],textTracksEvents:["addtrack","removetrack","change"],stateOwnersUpdateHandlers:[(e,t)=>{var i;let{media:a}=t;if(!a)return;let r=a.querySelector('track[kind="chapters"][default][src]'),n=null==(i=a.shadowRoot)?void 0:i.querySelector(':is(video,audio) > track[kind="chapters"][default][src]');return null==r||r.addEventListener("load",e),null==n||n.addEventListener("load",e),()=>{null==r||r.removeEventListener("load",e),null==n||n.removeEventListener("load",e)}}]},mediaIsPip:{get(e){var t,i;let{media:a,documentElement:r}=e;if(!a||!r||!r.pictureInPictureElement)return!1;if(r.pictureInPictureElement===a)return!0;if(r.pictureInPictureElement instanceof HTMLMediaElement)return!!(null==(t=a.localName)?void 0:t.includes("-"))&&iT(a,r.pictureInPictureElement);if(r.pictureInPictureElement.localName.includes("-")){let e=r.pictureInPictureElement.shadowRoot;for(;null==e?void 0:e.pictureInPictureElement;){if(e.pictureInPictureElement===a)return!0;e=null==(i=e.pictureInPictureElement)?void 0:i.shadowRoot}}return!1},set(e,t){let{media:i}=t;if(i)if(e){if(!iu.pictureInPictureEnabled)return void console.warn("MediaChrome: Picture-in-picture is not enabled");if(!i.requestPictureInPicture)return void console.warn("MediaChrome: The current media does not support picture-in-picture");let e=()=>{console.warn("MediaChrome: The media is not ready for picture-in-picture. It must have a readyState > 0.")};i.requestPictureInPicture().catch(t=>{if(11===t.code){if(!i.src)return void console.warn("MediaChrome: The media is not ready for picture-in-picture. It must have a src set.");if(0===i.readyState&&"none"===i.preload){let t=()=>{i.removeEventListener("loadedmetadata",a),i.preload="none"},a=()=>{i.requestPictureInPicture().catch(e),t()};i.addEventListener("loadedmetadata",a),i.preload="metadata",setTimeout(()=>{0===i.readyState&&e(),t()},1e3)}else throw t}else throw t})}else iu.pictureInPictureElement&&iu.exitPictureInPicture()},mediaEvents:["enterpictureinpicture","leavepictureinpicture"]},mediaRenditionList:{get(e){var t;let{media:i}=e;return[...null!=(t=null==i?void 0:i.videoRenditions)?t:[]].map(e=>({...e}))},mediaEvents:["emptied","loadstart"],videoRenditionsEvents:["addrendition","removerendition"]},mediaRenditionSelected:{get(e){var t,i,a;let{media:r}=e;return null==(a=null==(i=null==r?void 0:r.videoRenditions)?void 0:i[null==(t=r.videoRenditions)?void 0:t.selectedIndex])?void 0:a.id},set(e,t){let{media:i}=t;if(!(null==i?void 0:i.videoRenditions))return void console.warn("MediaController: Rendition selection not supported by this media.");let a=Array.prototype.findIndex.call(i.videoRenditions,t=>t.id==e);i.videoRenditions.selectedIndex!=a&&(i.videoRenditions.selectedIndex=a)},mediaEvents:["emptied"],videoRenditionsEvents:["addrendition","removerendition","change"]},mediaAudioTrackList:{get(e){var t;let{media:i}=e;return[...null!=(t=null==i?void 0:i.audioTracks)?t:[]]},mediaEvents:["emptied","loadstart"],audioTracksEvents:["addtrack","removetrack"]},mediaAudioTrackEnabled:{get(e){var t,i;let{media:a}=e;return null==(i=[...null!=(t=null==a?void 0:a.audioTracks)?t:[]].find(e=>e.enabled))?void 0:i.id},set(e,t){let{media:i}=t;if(!(null==i?void 0:i.audioTracks))return void console.warn("MediaChrome: Audio track selection not supported by this media.");for(let t of i.audioTracks)t.enabled=e==t.id},mediaEvents:["emptied"],audioTracksEvents:["addtrack","removetrack","change"]},mediaIsFullscreen:{get:e=>(e=>{var t;let{media:i,documentElement:a,fullscreenElement:r=i}=e;if(!i||!a)return!1;let n=(e=>{let{documentElement:t,media:i}=e,a=null==t?void 0:t[as];return!a&&"webkitDisplayingFullscreen"in i&&"webkitPresentationMode"in i&&i.webkitDisplayingFullscreen&&i.webkitPresentationMode===tZ.FULLSCREEN?i:a})(e);if(!n)return!1;if(n===r||n===i)return!0;if(n.localName.includes("-")){let e=n.shadowRoot;if(!(as in e))return iT(n,r);for(;null==e?void 0:e[as];){if(e[as]===r)return!0;e=null==(t=e[as])?void 0:t.shadowRoot}}return!1})(e),set(e,t,i){var a;e?((e=>{var t;let{media:i,fullscreenElement:a}=e;try{let e=a&&"requestFullscreen"in a?"requestFullscreen":a&&"webkitRequestFullScreen"in a?"webkitRequestFullScreen":void 0;if(e){let i=null==(t=a[e])?void 0:t.call(a);if(i instanceof Promise)return i.catch(()=>{})}else(null==i?void 0:i.webkitEnterFullscreen)?i.webkitEnterFullscreen():(null==i?void 0:i.requestFullscreen)&&i.requestFullscreen()}catch(e){console.error(e)}})(t),i.detail&&(null==(a=t.media)||a.focus())):(e=>{var t;let{documentElement:i}=e;if(an){let e=null==(t=null==i?void 0:i[an])?void 0:t.call(i);if(e instanceof Promise)return e.catch(()=>{})}})(t)},rootEvents:["fullscreenchange","webkitfullscreenchange"],mediaEvents:["webkitbeginfullscreen","webkitendfullscreen","webkitpresentationmodechanged"]},mediaIsCasting:{get(e){var t;let{media:i}=e;return!!(null==i?void 0:i.remote)&&(null==(t=i.remote)?void 0:t.state)!=="disconnected"&&!!i.remote.state},set(e,t){var i,a;let{media:r}=t;if(r&&(!e||(null==(i=r.remote)?void 0:i.state)==="disconnected")&&(e||(null==(a=r.remote)?void 0:a.state)==="connected")){if("function"!=typeof r.remote.prompt)return void console.warn("MediaChrome: Casting is not supported in this environment");r.remote.prompt().catch(()=>{})}},remoteEvents:["connect","connecting","disconnect"]},mediaIsAirplaying:{get:()=>!1,set(e,t){let{media:i}=t;if(i){if(!(i.webkitShowPlaybackTargetPicker&&id.WebKitPlaybackTargetAvailabilityEvent))return void console.error("MediaChrome: received a request to select AirPlay but AirPlay is not supported in this environment");i.webkitShowPlaybackTargetPicker()}},mediaEvents:["webkitcurrentplaybacktargetiswirelesschanged"]},mediaFullscreenUnavailable:{get(e){let{media:t}=e;if(!av||!ap(t))return tG.UNSUPPORTED}},mediaPipUnavailable:{get(e){let{media:t}=e;return ab&&ac(t)?(null==t?void 0:t.disablePictureInPicture)?tG.UNAVAILABLE:void 0:tG.UNSUPPORTED}},mediaVolumeUnavailable:{get(e){let{media:t}=e;if(!1===i||(null==t?void 0:t.volume)==void 0)return tG.UNSUPPORTED},stateOwnersUpdateHandlers:[e=>{null==i&&aw.then(t=>e(t?void 0:tG.UNSUPPORTED))}]},mediaCastUnavailable:{get(e,{availability:t="not-available"}={}){var i;let{media:a}=e;return ag&&(null==(i=null==a?void 0:a.remote)?void 0:i.state)?null!=t&&"available"!==t?tG.UNAVAILABLE:void 0:tG.UNSUPPORTED},stateOwnersUpdateHandlers:[(e,t)=>{var i;let{media:a}=t;if(a)return a.disableRemotePlayback||a.hasAttribute("disableremoteplayback")||null==(i=null==a?void 0:a.remote)||i.watchAvailability(t=>{e({availability:t?"available":"not-available"})}).catch(t=>{"NotSupportedError"===t.name?e({availability:null}):e({availability:"not-available"})}),()=>{var e;null==(e=null==a?void 0:a.remote)||e.cancelWatchAvailability().catch(()=>{})}}]},mediaAirplayUnavailable:{get:(e,t)=>aE?(null==t?void 0:t.availability)==="not-available"?tG.UNAVAILABLE:void 0:tG.UNSUPPORTED,mediaEvents:["webkitplaybacktargetavailabilitychanged"],stateOwnersUpdateHandlers:[(e,t)=>{var i;let{media:a}=t;if(a)return a.disableRemotePlayback||a.hasAttribute("disableremoteplayback")||null==(i=null==a?void 0:a.remote)||i.watchAvailability(t=>{e({availability:t?"available":"not-available"})}).catch(t=>{"NotSupportedError"===t.name?e({availability:null}):e({availability:"not-available"})}),()=>{var e;null==(e=null==a?void 0:a.remote)||e.cancelWatchAvailability().catch(()=>{})}}]},mediaRenditionUnavailable:{get(e){var t;let{media:i}=e;return(null==i?void 0:i.videoRenditions)?(null==(t=i.videoRenditions)?void 0:t.length)?void 0:tG.UNAVAILABLE:tG.UNSUPPORTED},mediaEvents:["emptied","loadstart"],videoRenditionsEvents:["addrendition","removerendition"]},mediaAudioTrackUnavailable:{get(e){var t,i;let{media:a}=e;return(null==a?void 0:a.audioTracks)?(null!=(i=null==(t=a.audioTracks)?void 0:t.length)?i:0)<=1?tG.UNAVAILABLE:void 0:tG.UNSUPPORTED},mediaEvents:["emptied","loadstart"],audioTracksEvents:["addtrack","removetrack"]},mediaLang:{get(e){let{options:{mediaLang:t}={}}=e;return null!=t?t:"en"}}},aS={[tN.MEDIA_PREVIEW_REQUEST](e,t,{detail:i}){var a,r,n;let s,o,{media:l}=t,d=null!=i?i:void 0;if(l&&null!=d){let[e]=aa(l,{kind:tV.METADATA,label:"thumbnails"}),t=Array.prototype.find.call(null!=(a=null==e?void 0:e.cues)?a:[],(e,t,i)=>0===t?e.endTime>d:t===i.length-1?e.startTime<=d:e.startTime<=d&&e.endTime>d);if(t){let e=/'^(?:[a-z]+:)?\/\//i.test(t.text)||null==(r=null==l?void 0:l.querySelector('track[label="thumbnails"]'))?void 0:r.src,i=new URL(t.text,e);o=new URLSearchParams(i.hash).get("#xywh").split(",").map(e=>+e),s=i.href}}let u=e.mediaDuration.get(t),m=null==(n=e.mediaChaptersCues.get(t).find((e,t,i)=>t===i.length-1&&u===e.endTime?e.startTime<=d&&e.endTime>=d:e.startTime<=d&&e.endTime>d))?void 0:n.text;return null!=i&&null==m&&(m=""),{mediaPreviewTime:d,mediaPreviewImage:s,mediaPreviewCoords:o,mediaPreviewChapter:m}},[tN.MEDIA_PAUSE_REQUEST](e,t){e.mediaPaused.set(!0,t)},[tN.MEDIA_PLAY_REQUEST](e,t){var i,a,r,n;let s=e.mediaStreamType.get(t)===tq.LIVE,o=!(null==(i=t.options)?void 0:i.noAutoSeekToLive),l=e.mediaTargetLiveWindow.get(t)>0;if(s&&o&&!l){let i=null==(a=e.mediaSeekable.get(t))?void 0:a[1];if(i){let a=null!=(n=null==(r=t.options)?void 0:r.seekToLiveOffset)?n:0;e.mediaCurrentTime.set(i-a,t)}}e.mediaPaused.set(!1,t)},[tN.MEDIA_PLAYBACK_RATE_REQUEST](e,t,{detail:i}){e.mediaPlaybackRate.set(i,t)},[tN.MEDIA_MUTE_REQUEST](e,t){e.mediaMuted.set(!0,t)},[tN.MEDIA_UNMUTE_REQUEST](e,t){e.mediaVolume.get(t)||e.mediaVolume.set(.25,t),e.mediaMuted.set(!1,t)},[tN.MEDIA_LOOP_REQUEST](e,t,{detail:i}){let a=!!i;return e.mediaLoop.set(a,t),{mediaLoop:a}},[tN.MEDIA_VOLUME_REQUEST](e,t,{detail:i}){i&&e.mediaMuted.get(t)&&e.mediaMuted.set(!1,t),e.mediaVolume.set(i,t)},[tN.MEDIA_SEEK_REQUEST](e,t,{detail:i}){e.mediaCurrentTime.set(i,t)},[tN.MEDIA_SEEK_TO_LIVE_REQUEST](e,t){var i,a,r;let n=null==(i=e.mediaSeekable.get(t))?void 0:i[1];if(Number.isNaN(Number(n)))return;let s=null!=(r=null==(a=t.options)?void 0:a.seekToLiveOffset)?r:0;e.mediaCurrentTime.set(n-s,t)},[tN.MEDIA_SHOW_SUBTITLES_REQUEST](e,t,{detail:i}){var a;let{options:r}=t,n=af(t),s=i6(i),o=null==(a=s[0])?void 0:a.language;o&&!r.noSubtitlesLangPref&&id.localStorage.setItem("media-chrome-pref-subtitles-lang",o),ai(tK.SHOWING,n,s)},[tN.MEDIA_DISABLE_SUBTITLES_REQUEST](e,t,{detail:i}){let a=af(t);ai(tK.DISABLED,a,null!=i?i:[])},[tN.MEDIA_TOGGLE_SUBTITLES_REQUEST](e,t,{detail:i}){ay(t,i)},[tN.MEDIA_RENDITION_REQUEST](e,t,{detail:i}){e.mediaRenditionSelected.set(i,t)},[tN.MEDIA_AUDIO_TRACK_REQUEST](e,t,{detail:i}){e.mediaAudioTrackEnabled.set(i,t)},[tN.MEDIA_ENTER_PIP_REQUEST](e,t){e.mediaIsFullscreen.get(t)&&e.mediaIsFullscreen.set(!1,t),e.mediaIsPip.set(!0,t)},[tN.MEDIA_EXIT_PIP_REQUEST](e,t){e.mediaIsPip.set(!1,t)},[tN.MEDIA_ENTER_FULLSCREEN_REQUEST](e,t,i){e.mediaIsPip.get(t)&&e.mediaIsPip.set(!1,t),e.mediaIsFullscreen.set(!0,t,i)},[tN.MEDIA_EXIT_FULLSCREEN_REQUEST](e,t){e.mediaIsFullscreen.set(!1,t)},[tN.MEDIA_ENTER_CAST_REQUEST](e,t){e.mediaIsFullscreen.get(t)&&e.mediaIsFullscreen.set(!1,t),e.mediaIsCasting.set(!0,t)},[tN.MEDIA_EXIT_CAST_REQUEST](e,t){e.mediaIsCasting.set(!1,t)},[tN.MEDIA_AIRPLAY_REQUEST](e,t){e.mediaIsAirplaying.set(!0,t)}};var aM=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},aL=(e,t,i)=>(aM(e,t,"read from private field"),i?i.call(e):t.get(e)),aD=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},ax=(e,t,i,a)=>(aM(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i),aN=(e,t,i)=>(aM(e,t,"access private method"),i);let aO=["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Enter"," ","f","m","k","c","l","j",">","<","p"],aP="defaultsubtitles",aU="defaultstreamtype",aW="defaultduration",a$="fullscreenelement",aB="hotkeys",aH="keyboardbackwardseekoffset",aV="keyboardforwardseekoffset",aK="keyboarddownvolumestep",aF="keyboardupvolumestep",aY="keysused",aG="lang",aq="loop",aj="liveedgeoffset",aZ="noautoseektolive",aQ="nodefaultstore",az="nohotkeys",aX="nomutedpref",aJ="nosubtitleslangpref",a0="novolumepref",a1="seektoliveoffset";class a2 extends i0{constructor(){super(),aD(this,l_),aD(this,lI),aD(this,lC),aD(this,lM),this.mediaStateReceivers=[],this.associatedElementSubscriptions=new Map,aD(this,lb,new i5(this,aB)),aD(this,lE,void 0),aD(this,lg,void 0),aD(this,lf,null),aD(this,lA,void 0),aD(this,ly,void 0),aD(this,lT,e=>{var t;null==(t=aL(this,lg))||t.dispatch(e)}),aD(this,lk,void 0),this.associateElement(this);let e={};ax(this,lA,t=>{Object.entries(t).forEach(([t,i])=>{if(t in e&&e[t]===i)return;this.propagateMediaState(t,i);let a=t.toLowerCase(),r=new id.CustomEvent(tH[a],{composed:!0,detail:i});this.dispatchEvent(r)}),e=t}),this.hasAttribute(az)?this.disableHotkeys():this.enableHotkeys()}static get observedAttributes(){return super.observedAttributes.concat(az,aB,aU,aP,aW,aX,a0,aG,aq)}get mediaStore(){return aL(this,lg)}set mediaStore(e){var t,i;(aL(this,lg)&&(null==(t=aL(this,ly))||t.call(this),ax(this,ly,void 0)),ax(this,lg,e),aL(this,lg)||this.hasAttribute(aQ))?ax(this,ly,null==(i=aL(this,lg))?void 0:i.subscribe(aL(this,lA))):aN(this,l_,lw).call(this)}get fullscreenElement(){var e;return null!=(e=aL(this,lE))?e:this}set fullscreenElement(e){var t;this.hasAttribute(a$)&&this.removeAttribute(a$),ax(this,lE,e),null==(t=aL(this,lg))||t.dispatch({type:"fullscreenelementchangerequest",detail:this.fullscreenElement})}get defaultSubtitles(){return iL(this,aP)}set defaultSubtitles(e){iD(this,aP,e)}get defaultStreamType(){return ix(this,aU)}set defaultStreamType(e){iN(this,aU,e)}get defaultDuration(){return iS(this,aW)}set defaultDuration(e){iM(this,aW,e)}get noHotkeys(){return iL(this,az)}set noHotkeys(e){iD(this,az,e)}get keysUsed(){return ix(this,aY)}set keysUsed(e){iN(this,aY,e)}get liveEdgeOffset(){return iS(this,aj)}set liveEdgeOffset(e){iM(this,aj,e)}get noAutoSeekToLive(){return iL(this,aZ)}set noAutoSeekToLive(e){iD(this,aZ,e)}get noVolumePref(){return iL(this,a0)}set noVolumePref(e){iD(this,a0,e)}get noMutedPref(){return iL(this,aX)}set noMutedPref(e){iD(this,aX,e)}get noSubtitlesLangPref(){return iL(this,aJ)}set noSubtitlesLangPref(e){iD(this,aJ,e)}get noDefaultStore(){return iL(this,aQ)}set noDefaultStore(e){iD(this,aQ,e)}attributeChangedCallback(e,t,i){var a,r,n,s,o,l,d,u,m,h,c,p;if(super.attributeChangedCallback(e,t,i),e===az)i!==t&&""===i?(this.hasAttribute(aB)&&console.warn("Media Chrome: Both `hotkeys` and `nohotkeys` have been set. All hotkeys will be disabled."),this.disableHotkeys()):i!==t&&null===i&&this.enableHotkeys();else if(e===aB)aL(this,lb).value=i;else if(e===aP&&i!==t)null==(a=aL(this,lg))||a.dispatch({type:"optionschangerequest",detail:{defaultSubtitles:this.hasAttribute(aP)}});else if(e===aU)null==(n=aL(this,lg))||n.dispatch({type:"optionschangerequest",detail:{defaultStreamType:null!=(r=this.getAttribute(aU))?r:void 0}});else if(e===aj)null==(s=aL(this,lg))||s.dispatch({type:"optionschangerequest",detail:{liveEdgeOffset:this.hasAttribute(aj)?+this.getAttribute(aj):void 0,seekToLiveOffset:this.hasAttribute(a1)?void 0:+this.getAttribute(aj)}});else if(e===a1)null==(o=aL(this,lg))||o.dispatch({type:"optionschangerequest",detail:{seekToLiveOffset:this.hasAttribute(a1)?+this.getAttribute(a1):void 0}});else if(e===aZ)null==(l=aL(this,lg))||l.dispatch({type:"optionschangerequest",detail:{noAutoSeekToLive:this.hasAttribute(aZ)}});else if(e===a$){let e=i?null==(d=this.getRootNode())?void 0:d.getElementById(i):void 0;ax(this,lE,e),null==(u=aL(this,lg))||u.dispatch({type:"fullscreenelementchangerequest",detail:this.fullscreenElement})}else e===aG&&i!==t?(t7=i,null==(m=aL(this,lg))||m.dispatch({type:"optionschangerequest",detail:{mediaLang:i}})):e===aq&&i!==t?null==(h=aL(this,lg))||h.dispatch({type:tN.MEDIA_LOOP_REQUEST,detail:null!=i}):e===a0&&i!==t?null==(c=aL(this,lg))||c.dispatch({type:"optionschangerequest",detail:{noVolumePref:this.hasAttribute(a0)}}):e===aX&&i!==t&&(null==(p=aL(this,lg))||p.dispatch({type:"optionschangerequest",detail:{noMutedPref:this.hasAttribute(aX)}}))}connectedCallback(){var e,t;aL(this,lg)||this.hasAttribute(aQ)||aN(this,l_,lw).call(this),null==(e=aL(this,lg))||e.dispatch({type:"documentelementchangerequest",detail:iu}),super.connectedCallback(),aL(this,lg)&&!aL(this,ly)&&ax(this,ly,null==(t=aL(this,lg))?void 0:t.subscribe(aL(this,lA))),void 0!==aL(this,lk)&&aL(this,lg)&&this.media&&setTimeout(()=>{var e,t,i;(null==(t=null==(e=this.media)?void 0:e.textTracks)?void 0:t.length)&&(null==(i=aL(this,lg))||i.dispatch({type:tN.MEDIA_TOGGLE_SUBTITLES_REQUEST,detail:aL(this,lk)}))},0),this.hasAttribute(az)?this.disableHotkeys():this.enableHotkeys()}disconnectedCallback(){var e,t,i,a,r;if(null==(e=super.disconnectedCallback)||e.call(this),aL(this,lg)){let e=aL(this,lg).getState();ax(this,lk,!!(null==(t=e.mediaSubtitlesShowing)?void 0:t.length)),null==(i=aL(this,lg))||i.dispatch({type:"documentelementchangerequest",detail:void 0}),null==(a=aL(this,lg))||a.dispatch({type:tN.MEDIA_TOGGLE_SUBTITLES_REQUEST,detail:!1})}aL(this,ly)&&(null==(r=aL(this,ly))||r.call(this),ax(this,ly,void 0))}mediaSetCallback(e){var t;super.mediaSetCallback(e),null==(t=aL(this,lg))||t.dispatch({type:"mediaelementchangerequest",detail:e}),e.hasAttribute("tabindex")||(e.tabIndex=-1)}mediaUnsetCallback(e){var t;super.mediaUnsetCallback(e),null==(t=aL(this,lg))||t.dispatch({type:"mediaelementchangerequest",detail:void 0})}propagateMediaState(e,t){rt(this.mediaStateReceivers,e,t)}associateElement(e){if(!e)return;let{associatedElementSubscriptions:t}=this;if(t.has(e))return;let i=ri(e,this.registerMediaStateReceiver.bind(this),this.unregisterMediaStateReceiver.bind(this));Object.values(tN).forEach(t=>{e.addEventListener(t,aL(this,lT))}),t.set(e,i)}unassociateElement(e){if(!e)return;let{associatedElementSubscriptions:t}=this;t.has(e)&&(t.get(e)(),t.delete(e),Object.values(tN).forEach(t=>{e.removeEventListener(t,aL(this,lT))}))}registerMediaStateReceiver(e){if(!e)return;let t=this.mediaStateReceivers;!(t.indexOf(e)>-1)&&(t.push(e),aL(this,lg)&&Object.entries(aL(this,lg).getState()).forEach(([t,i])=>{rt([e],t,i)}))}unregisterMediaStateReceiver(e){let t=this.mediaStateReceivers,i=t.indexOf(e);i<0||t.splice(i,1)}enableHotkeys(){this.addEventListener("keydown",aN(this,lC,lS))}disableHotkeys(){this.removeEventListener("keydown",aN(this,lC,lS)),this.removeEventListener("keyup",aN(this,lI,lR))}get hotkeys(){return ix(this,aB)}set hotkeys(e){iN(this,aB,e)}keyboardShortcutHandler(e){var t,i,a,r,n,s,o,l,d;let u,m,h,c=e.target;if(!((null!=(a=null!=(i=null==(t=c.getAttribute(aY))?void 0:t.split(" "))?i:null==c?void 0:c.keysUsed)?a:[]).map(e=>"Space"===e?" ":e).filter(Boolean).includes(e.key)||aL(this,lb).contains(`no${e.key.toLowerCase()}`)||" "===e.key&&aL(this,lb).contains("nospace"))&&!(e.shiftKey&&("/"===e.key||"?"===e.key)&&aL(this,lb).contains("noshift+/")))switch(e.key){case" ":case"k":u=aL(this,lg).getState().mediaPaused?tN.MEDIA_PLAY_REQUEST:tN.MEDIA_PAUSE_REQUEST,this.dispatchEvent(new id.CustomEvent(u,{composed:!0,bubbles:!0}));break;case"m":u="off"===this.mediaStore.getState().mediaVolumeLevel?tN.MEDIA_UNMUTE_REQUEST:tN.MEDIA_MUTE_REQUEST,this.dispatchEvent(new id.CustomEvent(u,{composed:!0,bubbles:!0}));break;case"f":u=this.mediaStore.getState().mediaIsFullscreen?tN.MEDIA_EXIT_FULLSCREEN_REQUEST:tN.MEDIA_ENTER_FULLSCREEN_REQUEST,this.dispatchEvent(new id.CustomEvent(u,{composed:!0,bubbles:!0}));break;case"c":this.dispatchEvent(new id.CustomEvent(tN.MEDIA_TOGGLE_SUBTITLES_REQUEST,{composed:!0,bubbles:!0}));break;case"ArrowLeft":case"j":{let e=this.hasAttribute(aH)?+this.getAttribute(aH):10;m=Math.max((null!=(r=this.mediaStore.getState().mediaCurrentTime)?r:0)-e,0),h=new id.CustomEvent(tN.MEDIA_SEEK_REQUEST,{composed:!0,bubbles:!0,detail:m}),this.dispatchEvent(h);break}case"ArrowRight":case"l":{let e=this.hasAttribute(aV)?+this.getAttribute(aV):10;m=Math.max((null!=(n=this.mediaStore.getState().mediaCurrentTime)?n:0)+e,0),h=new id.CustomEvent(tN.MEDIA_SEEK_REQUEST,{composed:!0,bubbles:!0,detail:m}),this.dispatchEvent(h);break}case"ArrowUp":{let e=this.hasAttribute(aF)?+this.getAttribute(aF):.025;m=Math.min((null!=(s=this.mediaStore.getState().mediaVolume)?s:1)+e,1),h=new id.CustomEvent(tN.MEDIA_VOLUME_REQUEST,{composed:!0,bubbles:!0,detail:m}),this.dispatchEvent(h);break}case"ArrowDown":{let e=this.hasAttribute(aK)?+this.getAttribute(aK):.025;m=Math.max((null!=(o=this.mediaStore.getState().mediaVolume)?o:1)-e,0),h=new id.CustomEvent(tN.MEDIA_VOLUME_REQUEST,{composed:!0,bubbles:!0,detail:m}),this.dispatchEvent(h);break}case"<":m=Math.max((null!=(l=this.mediaStore.getState().mediaPlaybackRate)?l:1)-.25,.25).toFixed(2),h=new id.CustomEvent(tN.MEDIA_PLAYBACK_RATE_REQUEST,{composed:!0,bubbles:!0,detail:m}),this.dispatchEvent(h);break;case">":m=Math.min((null!=(d=this.mediaStore.getState().mediaPlaybackRate)?d:1)+.25,2).toFixed(2),h=new id.CustomEvent(tN.MEDIA_PLAYBACK_RATE_REQUEST,{composed:!0,bubbles:!0,detail:m}),this.dispatchEvent(h);break;case"/":case"?":e.shiftKey&&aN(this,lM,lL).call(this);break;case"p":u=this.mediaStore.getState().mediaIsPip?tN.MEDIA_EXIT_PIP_REQUEST:tN.MEDIA_ENTER_PIP_REQUEST,h=new id.CustomEvent(u,{composed:!0,bubbles:!0}),this.dispatchEvent(h)}}}lb=new WeakMap,lE=new WeakMap,lg=new WeakMap,lf=new WeakMap,lA=new WeakMap,ly=new WeakMap,lT=new WeakMap,lk=new WeakMap,l_=new WeakSet,lw=function(){var e;this.mediaStore=(({media:e,fullscreenElement:t,documentElement:i,stateMediator:a=aC,requestMap:r=aS,options:n={},monitorStateOwnersOnlyWithSubscriptions:s=!0})=>{let o,l=[],d={options:{...n}},u=Object.freeze({mediaPreviewTime:void 0,mediaPreviewImage:void 0,mediaPreviewCoords:void 0,mediaPreviewChapter:void 0}),m=e=>{void 0==e||aT(e,u)||(u=Object.freeze({...u,...e}),l.forEach(e=>e(u)))},h=()=>{m(Object.entries(a).reduce((e,[t,{get:i}])=>(e[t]=i(d),e),{}))},c={},p=async(e,t)=>{var i,r,n,u,p,v,b,E,g,f,A,y,T,k,_,w;let I=!!o;if(o={...d,...null!=o?o:{},...e},I)return;await aI(...Object.values(e));let R=l.length>0&&0===t&&s,C=d.media!==o.media,S=(null==(i=d.media)?void 0:i.textTracks)!==(null==(r=o.media)?void 0:r.textTracks),M=(null==(n=d.media)?void 0:n.videoRenditions)!==(null==(u=o.media)?void 0:u.videoRenditions),L=(null==(p=d.media)?void 0:p.audioTracks)!==(null==(v=o.media)?void 0:v.audioTracks),D=(null==(b=d.media)?void 0:b.remote)!==(null==(E=o.media)?void 0:E.remote),x=d.documentElement!==o.documentElement,N=!!d.media&&(C||R),O=!!(null==(g=d.media)?void 0:g.textTracks)&&(S||R),P=!!(null==(f=d.media)?void 0:f.videoRenditions)&&(M||R),U=!!(null==(A=d.media)?void 0:A.audioTracks)&&(L||R),W=!!(null==(y=d.media)?void 0:y.remote)&&(D||R),$=!!d.documentElement&&(x||R),B=N||O||P||U||W||$,H=0===l.length&&1===t&&s,V=!!o.media&&(C||H),K=!!(null==(T=o.media)?void 0:T.textTracks)&&(S||H),F=!!(null==(k=o.media)?void 0:k.videoRenditions)&&(M||H),Y=!!(null==(_=o.media)?void 0:_.audioTracks)&&(L||H),G=!!(null==(w=o.media)?void 0:w.remote)&&(D||H),q=!!o.documentElement&&(x||H),j=V||K||F||Y||G||q;if(!(B||j)){Object.entries(o).forEach(([e,t])=>{d[e]=t}),h(),o=void 0;return}Object.entries(a).forEach(([e,{get:t,mediaEvents:i=[],textTracksEvents:a=[],videoRenditionsEvents:r=[],audioTracksEvents:n=[],remoteEvents:s=[],rootEvents:l=[],stateOwnersUpdateHandlers:u=[]}])=>{let h;c[e]||(c[e]={});let p=i=>{m({[e]:t(d,i)})};h=c[e].mediaEvents,i.forEach(t=>{h&&N&&(d.media.removeEventListener(t,h),c[e].mediaEvents=void 0),V&&(o.media.addEventListener(t,p),c[e].mediaEvents=p)}),h=c[e].textTracksEvents,a.forEach(t=>{var i,a;h&&O&&(null==(i=d.media.textTracks)||i.removeEventListener(t,h),c[e].textTracksEvents=void 0),K&&(null==(a=o.media.textTracks)||a.addEventListener(t,p),c[e].textTracksEvents=p)}),h=c[e].videoRenditionsEvents,r.forEach(t=>{var i,a;h&&P&&(null==(i=d.media.videoRenditions)||i.removeEventListener(t,h),c[e].videoRenditionsEvents=void 0),F&&(null==(a=o.media.videoRenditions)||a.addEventListener(t,p),c[e].videoRenditionsEvents=p)}),h=c[e].audioTracksEvents,n.forEach(t=>{var i,a;h&&U&&(null==(i=d.media.audioTracks)||i.removeEventListener(t,h),c[e].audioTracksEvents=void 0),Y&&(null==(a=o.media.audioTracks)||a.addEventListener(t,p),c[e].audioTracksEvents=p)}),h=c[e].remoteEvents,s.forEach(t=>{var i,a;h&&W&&(null==(i=d.media.remote)||i.removeEventListener(t,h),c[e].remoteEvents=void 0),G&&(null==(a=o.media.remote)||a.addEventListener(t,p),c[e].remoteEvents=p)}),h=c[e].rootEvents,l.forEach(t=>{h&&$&&(d.documentElement.removeEventListener(t,h),c[e].rootEvents=void 0),q&&(o.documentElement.addEventListener(t,p),c[e].rootEvents=p)});let v=c[e].stateOwnersUpdateHandlers;if(v&&B&&(Array.isArray(v)?v:[v]).forEach(e=>{"function"==typeof e&&e()}),j){let t=u.map(e=>e(p,o)).filter(e=>"function"==typeof e);c[e].stateOwnersUpdateHandlers=1===t.length?t[0]:t}else B&&(c[e].stateOwnersUpdateHandlers=void 0)}),Object.entries(o).forEach(([e,t])=>{d[e]=t}),h(),o=void 0};return p({media:e,fullscreenElement:t,documentElement:i,options:n}),{dispatch(e){let{type:t,detail:i}=e;r[t]&&null==u.mediaErrorCode?m(r[t](a,d,e)):"mediaelementchangerequest"===t?p({media:i}):"fullscreenelementchangerequest"===t?p({fullscreenElement:i}):"documentelementchangerequest"===t?p({documentElement:i}):"optionschangerequest"===t&&(Object.entries(null!=i?i:{}).forEach(([e,t])=>{d.options[e]=t}),h())},getState:()=>u,subscribe:e=>(p({},l.length+1),l.push(e),e(u),()=>{let t=l.indexOf(e);t>=0&&(p({},l.length-1),l.splice(t,1))})}})({media:this.media,fullscreenElement:this.fullscreenElement,options:{defaultSubtitles:this.hasAttribute(aP),defaultDuration:this.hasAttribute(aW)?+this.getAttribute(aW):void 0,defaultStreamType:null!=(e=this.getAttribute(aU))?e:void 0,liveEdgeOffset:this.hasAttribute(aj)?+this.getAttribute(aj):void 0,seekToLiveOffset:this.hasAttribute(a1)?+this.getAttribute(a1):this.hasAttribute(aj)?+this.getAttribute(aj):void 0,noAutoSeekToLive:this.hasAttribute(aZ),noVolumePref:this.hasAttribute(a0),noMutedPref:this.hasAttribute(aX),noSubtitlesLangPref:this.hasAttribute(aJ)}})},lI=new WeakSet,lR=function(e){let{key:t,shiftKey:i}=e;i&&("/"===t||"?"===t)||aO.includes(t)?this.keyboardShortcutHandler(e):this.removeEventListener("keyup",aN(this,lI,lR))},lC=new WeakSet,lS=function(e){var t;let{metaKey:i,altKey:a,key:r,shiftKey:n}=e,s=n&&("/"===r||"?"===r);if(s&&(null==(t=aL(this,lf))?void 0:t.open)||i||a||!s&&!aO.includes(r))return void this.removeEventListener("keyup",aN(this,lI,lR));let o=e.target,l=o instanceof HTMLElement&&("media-volume-range"===o.tagName.toLowerCase()||"media-time-range"===o.tagName.toLowerCase());![" ","ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(r)||aL(this,lb).contains(`no${r.toLowerCase()}`)||" "===r&&aL(this,lb).contains("nospace")||l||e.preventDefault(),this.addEventListener("keyup",aN(this,lI,lR),{once:!0})},lM=new WeakSet,lL=function(){aL(this,lf)||(ax(this,lf,iu.createElement("media-keyboard-shortcuts-dialog")),this.appendChild(aL(this,lf))),aL(this,lf).open=!0};let a3=Object.values(tW),a4=Object.values(tP),a5=e=>{var t,i,a,r;let{observedAttributes:n}=e.constructor;!n&&(null==(t=e.nodeName)?void 0:t.includes("-"))&&(id.customElements.upgrade(e),{observedAttributes:n}=e.constructor);let s=null==(r=null==(a=null==(i=null==e?void 0:e.getAttribute)?void 0:i.call(e,tO.MEDIA_CHROME_ATTRIBUTES))?void 0:a.split)?void 0:r.call(a,/\s+/);return Array.isArray(n||s)?(n||s).filter(e=>a3.includes(e)):[]},a9=e=>{var t,i;return(null==(t=e.nodeName)?void 0:t.includes("-"))&&id.customElements.get(null==(i=e.nodeName)?void 0:i.toLowerCase())&&!(e instanceof id.customElements.get(e.nodeName.toLowerCase()))&&id.customElements.upgrade(e),a4.some(t=>t in e)||!!a5(e).length},a8=e=>{var t;return null==(t=null==e?void 0:e.join)?void 0:t.call(e,":")},a6={[tW.MEDIA_SUBTITLES_LIST]:ae,[tW.MEDIA_SUBTITLES_SHOWING]:ae,[tW.MEDIA_SEEKABLE]:a8,[tW.MEDIA_BUFFERED]:e=>null==e?void 0:e.map(a8).join(" "),[tW.MEDIA_PREVIEW_COORDS]:e=>null==e?void 0:e.join(" "),[tW.MEDIA_RENDITION_LIST]:function(e){return null==e?void 0:e.map(tQ).join(" ")},[tW.MEDIA_AUDIO_TRACK_LIST]:function(e){return null==e?void 0:e.map(tX).join(" ")}},a7=async(e,t,i)=>{var a,r;if(e.isConnected||await t2(0),"boolean"==typeof i||null==i)return iD(e,t,i);if("number"==typeof i)return iM(e,t,i);if("string"==typeof i)return iN(e,t,i);if(Array.isArray(i)&&!i.length)return e.removeAttribute(t);let n=null!=(r=null==(a=a6[t])?void 0:a.call(a6,i))?r:i;return e.setAttribute(t,n)},re=(e,t)=>{var i;if(null==(i=e.closest)?void 0:i.call(e,'*[slot="media"]'))return;let a=(e,t)=>{var i,a;a9(e)&&t(e);let{children:r=[]}=null!=e?e:{};[...r,...null!=(a=null==(i=null==e?void 0:e.shadowRoot)?void 0:i.children)?a:[]].forEach(e=>re(e,t))},r=null==e?void 0:e.nodeName.toLowerCase();r.includes("-")&&!a9(e)?id.customElements.whenDefined(r).then(()=>{a(e,t)}):a(e,t)},rt=(e,t,i)=>{e.forEach(e=>{if(t in e){e[t]=i;return}let a=a5(e),r=t.toLowerCase();a.includes(r)&&a7(e,r,i)})},ri=(e,t,i)=>{re(e,t);let a=e=>{var i;t(null!=(i=null==e?void 0:e.composedPath()[0])?i:e.target)},r=e=>{var t;i(null!=(t=null==e?void 0:e.composedPath()[0])?t:e.target)};e.addEventListener(tN.REGISTER_MEDIA_STATE_RECEIVER,a),e.addEventListener(tN.UNREGISTER_MEDIA_STATE_RECEIVER,r);let n=[],s=e=>{let a=e.target;"media"!==a.name&&(n.forEach(e=>re(e,i)),(n=[...a.assignedElements({flatten:!0})]).forEach(e=>re(e,t)))};e.addEventListener("slotchange",s);let o=new MutationObserver(e=>{e.forEach(e=>{let{addedNodes:a=[],removedNodes:r=[],type:n,target:s,attributeName:o}=e;"childList"===n?(Array.prototype.forEach.call(a,e=>re(e,t)),Array.prototype.forEach.call(r,e=>re(e,i))):"attributes"===n&&o===tO.MEDIA_CHROME_ATTRIBUTES&&(a9(s)?t(s):i(s))})});return o.observe(e,{childList:!0,attributes:!0,subtree:!0}),()=>{re(e,i),e.removeEventListener("slotchange",s),o.disconnect(),e.removeEventListener(tN.REGISTER_MEDIA_STATE_RECEIVER,a),e.removeEventListener(tN.UNREGISTER_MEDIA_STATE_RECEIVER,r)}};id.customElements.get("media-controller")||id.customElements.define("media-controller",a2);let ra="placement",rr="bounds";class rn extends id.HTMLElement{constructor(){if(super(),this.updateXOffset=()=>{var e;if(!iI(this,{checkOpacity:!1,checkVisibilityCSS:!1}))return;let t=this.placement;if("left"===t||"right"===t)return void this.style.removeProperty("--media-tooltip-offset-x");let i=getComputedStyle(this),a=null!=(e=ik(this,"#"+this.bounds))?e:iE(this);if(!a)return;let{x:r,width:n}=a.getBoundingClientRect(),{x:s,width:o}=this.getBoundingClientRect(),l=i.getPropertyValue("--media-tooltip-offset-x"),d=l?parseFloat(l.replace("px","")):0,u=i.getPropertyValue("--media-tooltip-container-margin"),m=u?parseFloat(u.replace("px","")):0,h=s-r+d-m,c=s+o-(r+n)+d+m;h<0?this.style.setProperty("--media-tooltip-offset-x",`${h}px`):c>0?this.style.setProperty("--media-tooltip-offset-x",`${c}px`):this.style.removeProperty("--media-tooltip-offset-x")},!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);const e=ib(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e)}if(this.arrowEl=this.shadowRoot.querySelector("#arrow"),Object.prototype.hasOwnProperty.call(this,"placement")){const e=this.placement;delete this.placement,this.placement=e}}static get observedAttributes(){return[ra,rr]}get placement(){return ix(this,ra)}set placement(e){iN(this,ra,e)}get bounds(){return ix(this,rr)}set bounds(e){iN(this,rr,e)}}rn.shadowRootOptions={mode:"open"},rn.getTemplateHTML=function(e){return`
    <style>
      :host {
        --_tooltip-background-color: var(--media-tooltip-background-color, var(--media-secondary-color, rgba(20, 20, 30, .7)));
        --_tooltip-background: var(--media-tooltip-background, var(--_tooltip-background-color));
        --_tooltip-arrow-half-width: calc(var(--media-tooltip-arrow-width, 12px) / 2);
        --_tooltip-arrow-height: var(--media-tooltip-arrow-height, 5px);
        --_tooltip-arrow-background: var(--media-tooltip-arrow-color, var(--_tooltip-background-color));
        position: relative;
        pointer-events: none;
        display: var(--media-tooltip-display, inline-flex);
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        z-index: var(--media-tooltip-z-index, 1);
        background: var(--_tooltip-background);
        color: var(--media-text-color, var(--media-primary-color, rgb(238 238 238)));
        font: var(--media-font,
          var(--media-font-weight, 400)
          var(--media-font-size, 13px) /
          var(--media-text-content-height, var(--media-control-height, 18px))
          var(--media-font-family, helvetica neue, segoe ui, roboto, arial, sans-serif));
        padding: var(--media-tooltip-padding, .35em .7em);
        border: var(--media-tooltip-border, none);
        border-radius: var(--media-tooltip-border-radius, 5px);
        filter: var(--media-tooltip-filter, drop-shadow(0 0 4px rgba(0, 0, 0, .2)));
        white-space: var(--media-tooltip-white-space, nowrap);
      }

      :host([hidden]) {
        display: none;
      }

      img, svg {
        display: inline-block;
      }

      #arrow {
        position: absolute;
        width: 0px;
        height: 0px;
        border-style: solid;
        display: var(--media-tooltip-arrow-display, block);
      }

      :host(:not([placement])),
      :host([placement="top"]) {
        position: absolute;
        bottom: calc(100% + var(--media-tooltip-distance, 12px));
        left: 50%;
        transform: translate(calc(-50% - var(--media-tooltip-offset-x, 0px)), 0);
      }
      :host(:not([placement])) #arrow,
      :host([placement="top"]) #arrow {
        top: 100%;
        left: 50%;
        border-width: var(--_tooltip-arrow-height) var(--_tooltip-arrow-half-width) 0 var(--_tooltip-arrow-half-width);
        border-color: var(--_tooltip-arrow-background) transparent transparent transparent;
        transform: translate(calc(-50% + var(--media-tooltip-offset-x, 0px)), 0);
      }

      :host([placement="right"]) {
        position: absolute;
        left: calc(100% + var(--media-tooltip-distance, 12px));
        top: 50%;
        transform: translate(0, -50%);
      }
      :host([placement="right"]) #arrow {
        top: 50%;
        right: 100%;
        border-width: var(--_tooltip-arrow-half-width) var(--_tooltip-arrow-height) var(--_tooltip-arrow-half-width) 0;
        border-color: transparent var(--_tooltip-arrow-background) transparent transparent;
        transform: translate(0, -50%);
      }

      :host([placement="bottom"]) {
        position: absolute;
        top: calc(100% + var(--media-tooltip-distance, 12px));
        left: 50%;
        transform: translate(calc(-50% - var(--media-tooltip-offset-x, 0px)), 0);
      }
      :host([placement="bottom"]) #arrow {
        bottom: 100%;
        left: 50%;
        border-width: 0 var(--_tooltip-arrow-half-width) var(--_tooltip-arrow-height) var(--_tooltip-arrow-half-width);
        border-color: transparent transparent var(--_tooltip-arrow-background) transparent;
        transform: translate(calc(-50% + var(--media-tooltip-offset-x, 0px)), 0);
      }

      :host([placement="left"]) {
        position: absolute;
        right: calc(100% + var(--media-tooltip-distance, 12px));
        top: 50%;
        transform: translate(0, -50%);
      }
      :host([placement="left"]) #arrow {
        top: 50%;
        left: 100%;
        border-width: var(--_tooltip-arrow-half-width) 0 var(--_tooltip-arrow-half-width) var(--_tooltip-arrow-height);
        border-color: transparent transparent transparent var(--_tooltip-arrow-background);
        transform: translate(0, -50%);
      }
      
      :host([placement="none"]) #arrow {
        display: none;
      }
    </style>
    <slot></slot>
    <div id="arrow"></div>
  `},id.customElements.get("media-tooltip")||id.customElements.define("media-tooltip",rn);var rs=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},ro=(e,t,i)=>(rs(e,t,"read from private field"),i?i.call(e):t.get(e)),rl=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},rd=(e,t,i,a)=>(rs(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i);let ru="tooltipplacement",rm="disabled",rh="notooltip";class rc extends id.HTMLElement{constructor(){if(super(),rl(this,lU),rl(this,lD,void 0),this.preventClick=!1,this.tooltipEl=null,rl(this,lx,e=>{this.preventClick||this.handleClick(e),setTimeout(ro(this,lN),0)}),rl(this,lN,()=>{var e,t;null==(t=null==(e=this.tooltipEl)?void 0:e.updateXOffset)||t.call(e)}),rl(this,lO,e=>{let{key:t}=e;this.keysUsed.includes(t)?this.preventClick||this.handleClick(e):this.removeEventListener("keyup",ro(this,lO))}),rl(this,lP,e=>{let{metaKey:t,altKey:i,key:a}=e;t||i||!this.keysUsed.includes(a)?this.removeEventListener("keyup",ro(this,lO)):this.addEventListener("keyup",ro(this,lO),{once:!0})}),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);const e=ib(this.attributes),t=this.constructor.getTemplateHTML(e);this.shadowRoot.setHTMLUnsafe?this.shadowRoot.setHTMLUnsafe(t):this.shadowRoot.innerHTML=t}this.tooltipEl=this.shadowRoot.querySelector("media-tooltip")}static get observedAttributes(){return["disabled",ru,tO.MEDIA_CONTROLLER,tW.MEDIA_LANG]}enable(){this.addEventListener("click",ro(this,lx)),this.addEventListener("keydown",ro(this,lP)),this.tabIndex=0}disable(){this.removeEventListener("click",ro(this,lx)),this.removeEventListener("keydown",ro(this,lP)),this.removeEventListener("keyup",ro(this,lO)),this.tabIndex=-1}attributeChangedCallback(e,t,i){var a,r,n,s,o;e===tO.MEDIA_CONTROLLER?(t&&(null==(r=null==(a=ro(this,lD))?void 0:a.unassociateElement)||r.call(a,this),rd(this,lD,null)),i&&this.isConnected&&(rd(this,lD,null==(n=this.getRootNode())?void 0:n.getElementById(i)),null==(o=null==(s=ro(this,lD))?void 0:s.associateElement)||o.call(s,this))):"disabled"===e&&i!==t?null==i?this.enable():this.disable():e===ru&&this.tooltipEl&&i!==t?this.tooltipEl.placement=i:e===tW.MEDIA_LANG&&(this.shadowRoot.querySelector('slot[name="tooltip-content"]').innerHTML=this.constructor.getTooltipContentHTML()),ro(this,lN).call(this)}connectedCallback(){var e,t,i;let{style:a}=iR(this.shadowRoot,":host");a.setProperty("display",`var(--media-control-display, var(--${this.localName}-display, inline-flex))`),this.hasAttribute("disabled")?this.disable():this.enable(),this.setAttribute("role","button");let r=this.getAttribute(tO.MEDIA_CONTROLLER);r&&(rd(this,lD,null==(e=this.getRootNode())?void 0:e.getElementById(r)),null==(i=null==(t=ro(this,lD))?void 0:t.associateElement)||i.call(t,this)),id.customElements.whenDefined("media-tooltip").then(()=>{var e,t;return(e=lU,t=lW,rs(this,e,"access private method"),t).call(this)})}disconnectedCallback(){var e,t;this.disable(),null==(t=null==(e=ro(this,lD))?void 0:e.unassociateElement)||t.call(e,this),rd(this,lD,null),this.removeEventListener("mouseenter",ro(this,lN)),this.removeEventListener("focus",ro(this,lN)),this.removeEventListener("click",ro(this,lx))}get keysUsed(){return["Enter"," "]}get tooltipPlacement(){return ix(this,ru)}set tooltipPlacement(e){iN(this,ru,e)}get mediaController(){return ix(this,tO.MEDIA_CONTROLLER)}set mediaController(e){iN(this,tO.MEDIA_CONTROLLER,e)}get disabled(){return iL(this,rm)}set disabled(e){iD(this,rm,e)}get noTooltip(){return iL(this,rh)}set noTooltip(e){iD(this,rh,e)}handleClick(e){}}lD=new WeakMap,lx=new WeakMap,lN=new WeakMap,lO=new WeakMap,lP=new WeakMap,lU=new WeakSet,lW=function(){this.addEventListener("mouseenter",ro(this,lN)),this.addEventListener("focus",ro(this,lN)),this.addEventListener("click",ro(this,lx));let e=this.tooltipPlacement;e&&this.tooltipEl&&(this.tooltipEl.placement=e)},rc.shadowRootOptions={mode:"open"},rc.getTemplateHTML=function(e,t={}){return`
    <style>
      :host {
        position: relative;
        font: var(--media-font,
          var(--media-font-weight, bold)
          var(--media-font-size, 14px) /
          var(--media-text-content-height, var(--media-control-height, 24px))
          var(--media-font-family, helvetica neue, segoe ui, roboto, arial, sans-serif));
        color: var(--media-text-color, var(--media-primary-color, rgb(238 238 238)));
        background: var(--media-control-background, var(--media-secondary-color, rgb(20 20 30 / .7)));
        padding: var(--media-button-padding, var(--media-control-padding, 10px));
        justify-content: var(--media-button-justify-content, center);
        display: inline-flex;
        align-items: center;
        vertical-align: middle;
        box-sizing: border-box;
        transition: background .15s linear;
        pointer-events: auto;
        cursor: var(--media-cursor, pointer);
        -webkit-tap-highlight-color: transparent;
      }

      
      :host(:focus-visible) {
        box-shadow: var(--media-focus-box-shadow, inset 0 0 0 2px rgb(27 127 204 / .9));
        outline: 0;
      }
      
      :host(:where(:focus)) {
        box-shadow: none;
        outline: 0;
      }

      :host(:hover) {
        background: var(--media-control-hover-background, rgba(50 50 70 / .7));
      }

      svg, img, ::slotted(svg), ::slotted(img) {
        width: var(--media-button-icon-width);
        height: var(--media-button-icon-height, var(--media-control-height, 24px));
        transform: var(--media-button-icon-transform);
        transition: var(--media-button-icon-transition);
        fill: var(--media-icon-color, var(--media-primary-color, rgb(238 238 238)));
        vertical-align: middle;
        max-width: 100%;
        max-height: 100%;
        min-width: 100%;
      }

      media-tooltip {
        
        max-width: 0;
        overflow-x: clip;
        opacity: 0;
        transition: opacity .3s, max-width 0s 9s;
      }

      :host(:hover) media-tooltip,
      :host(:focus-visible) media-tooltip {
        max-width: 100vw;
        opacity: 1;
        transition: opacity .3s;
      }

      :host([notooltip]) slot[name="tooltip"] {
        display: none;
      }
    </style>

    ${this.getSlotTemplateHTML(e,t)}

    <slot name="tooltip">
      <media-tooltip part="tooltip" aria-hidden="true">
        <template shadowrootmode="${rn.shadowRootOptions.mode}">
          ${rn.getTemplateHTML({})}
        </template>
        <slot name="tooltip-content">
          ${this.getTooltipContentHTML(e)}
        </slot>
      </media-tooltip>
    </slot>
  `},rc.getSlotTemplateHTML=function(e,t){return`
    <slot></slot>
  `},rc.getTooltipContentHTML=function(){return""},id.customElements.get("media-chrome-button")||id.customElements.define("media-chrome-button",rc);let rp=`<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M22.13 3H3.87a.87.87 0 0 0-.87.87v13.26a.87.87 0 0 0 .87.87h3.4L9 16H5V5h16v11h-4l1.72 2h3.4a.87.87 0 0 0 .87-.87V3.87a.87.87 0 0 0-.86-.87Zm-8.75 11.44a.5.5 0 0 0-.76 0l-4.91 5.73a.5.5 0 0 0 .38.83h9.82a.501.501 0 0 0 .38-.83l-4.91-5.73Z"/>
</svg>
`,rv=e=>{let t=e.mediaIsAirplaying?ie("stop airplay"):ie("start airplay");e.setAttribute("aria-label",t)};class rb extends rc{static get observedAttributes(){return[...super.observedAttributes,tW.MEDIA_IS_AIRPLAYING,tW.MEDIA_AIRPLAY_UNAVAILABLE]}connectedCallback(){super.connectedCallback(),rv(this)}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),e===tW.MEDIA_IS_AIRPLAYING&&rv(this)}get mediaIsAirplaying(){return iL(this,tW.MEDIA_IS_AIRPLAYING)}set mediaIsAirplaying(e){iD(this,tW.MEDIA_IS_AIRPLAYING,e)}get mediaAirplayUnavailable(){return ix(this,tW.MEDIA_AIRPLAY_UNAVAILABLE)}set mediaAirplayUnavailable(e){iN(this,tW.MEDIA_AIRPLAY_UNAVAILABLE,e)}handleClick(){let e=new id.CustomEvent(tN.MEDIA_AIRPLAY_REQUEST,{composed:!0,bubbles:!0});this.dispatchEvent(e)}}rb.getSlotTemplateHTML=function(e){return`
    <style>
      :host([${tW.MEDIA_IS_AIRPLAYING}]) slot[name=icon] slot:not([name=exit]) {
        display: none !important;
      }

      
      :host(:not([${tW.MEDIA_IS_AIRPLAYING}])) slot[name=icon] slot:not([name=enter]) {
        display: none !important;
      }

      :host([${tW.MEDIA_IS_AIRPLAYING}]) slot[name=tooltip-enter],
      :host(:not([${tW.MEDIA_IS_AIRPLAYING}])) slot[name=tooltip-exit] {
        display: none;
      }
    </style>

    <slot name="icon">
      <slot name="enter">${rp}</slot>
      <slot name="exit">${rp}</slot>
    </slot>
  `},rb.getTooltipContentHTML=function(){return`
    <slot name="tooltip-enter">${ie("start airplay")}</slot>
    <slot name="tooltip-exit">${ie("stop airplay")}</slot>
  `},id.customElements.get("media-airplay-button")||id.customElements.define("media-airplay-button",rb);let rE=`<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M22.83 5.68a2.58 2.58 0 0 0-2.3-2.5c-3.62-.24-11.44-.24-15.06 0a2.58 2.58 0 0 0-2.3 2.5c-.23 4.21-.23 8.43 0 12.64a2.58 2.58 0 0 0 2.3 2.5c3.62.24 11.44.24 15.06 0a2.58 2.58 0 0 0 2.3-2.5c.23-4.21.23-8.43 0-12.64Zm-11.39 9.45a3.07 3.07 0 0 1-1.91.57 3.06 3.06 0 0 1-2.34-1 3.75 3.75 0 0 1-.92-2.67 3.92 3.92 0 0 1 .92-2.77 3.18 3.18 0 0 1 2.43-1 2.94 2.94 0 0 1 2.13.78c.364.359.62.813.74 1.31l-1.43.35a1.49 1.49 0 0 0-1.51-1.17 1.61 1.61 0 0 0-1.29.58 2.79 2.79 0 0 0-.5 1.89 3 3 0 0 0 .49 1.93 1.61 1.61 0 0 0 1.27.58 1.48 1.48 0 0 0 1-.37 2.1 2.1 0 0 0 .59-1.14l1.4.44a3.23 3.23 0 0 1-1.07 1.69Zm7.22 0a3.07 3.07 0 0 1-1.91.57 3.06 3.06 0 0 1-2.34-1 3.75 3.75 0 0 1-.92-2.67 3.88 3.88 0 0 1 .93-2.77 3.14 3.14 0 0 1 2.42-1 3 3 0 0 1 2.16.82 2.8 2.8 0 0 1 .73 1.31l-1.43.35a1.49 1.49 0 0 0-1.51-1.21 1.61 1.61 0 0 0-1.29.58A2.79 2.79 0 0 0 15 12a3 3 0 0 0 .49 1.93 1.61 1.61 0 0 0 1.27.58 1.44 1.44 0 0 0 1-.37 2.1 2.1 0 0 0 .6-1.15l1.4.44a3.17 3.17 0 0 1-1.1 1.7Z"/>
</svg>`,rg=`<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M17.73 14.09a1.4 1.4 0 0 1-1 .37 1.579 1.579 0 0 1-1.27-.58A3 3 0 0 1 15 12a2.8 2.8 0 0 1 .5-1.85 1.63 1.63 0 0 1 1.29-.57 1.47 1.47 0 0 1 1.51 1.2l1.43-.34A2.89 2.89 0 0 0 19 9.07a3 3 0 0 0-2.14-.78 3.14 3.14 0 0 0-2.42 1 3.91 3.91 0 0 0-.93 2.78 3.74 3.74 0 0 0 .92 2.66 3.07 3.07 0 0 0 2.34 1 3.07 3.07 0 0 0 1.91-.57 3.17 3.17 0 0 0 1.07-1.74l-1.4-.45c-.083.43-.3.822-.62 1.12Zm-7.22 0a1.43 1.43 0 0 1-1 .37 1.58 1.58 0 0 1-1.27-.58A3 3 0 0 1 7.76 12a2.8 2.8 0 0 1 .5-1.85 1.63 1.63 0 0 1 1.29-.57 1.47 1.47 0 0 1 1.51 1.2l1.43-.34a2.81 2.81 0 0 0-.74-1.32 2.94 2.94 0 0 0-2.13-.78 3.18 3.18 0 0 0-2.43 1 4 4 0 0 0-.92 2.78 3.74 3.74 0 0 0 .92 2.66 3.07 3.07 0 0 0 2.34 1 3.07 3.07 0 0 0 1.91-.57 3.23 3.23 0 0 0 1.07-1.74l-1.4-.45a2.06 2.06 0 0 1-.6 1.07Zm12.32-8.41a2.59 2.59 0 0 0-2.3-2.51C18.72 3.05 15.86 3 13 3c-2.86 0-5.72.05-7.53.17a2.59 2.59 0 0 0-2.3 2.51c-.23 4.207-.23 8.423 0 12.63a2.57 2.57 0 0 0 2.3 2.5c1.81.13 4.67.19 7.53.19 2.86 0 5.72-.06 7.53-.19a2.57 2.57 0 0 0 2.3-2.5c.23-4.207.23-8.423 0-12.63Zm-1.49 12.53a1.11 1.11 0 0 1-.91 1.11c-1.67.11-4.45.18-7.43.18-2.98 0-5.76-.07-7.43-.18a1.11 1.11 0 0 1-.91-1.11c-.21-4.14-.21-8.29 0-12.43a1.11 1.11 0 0 1 .91-1.11C7.24 4.56 10 4.49 13 4.49s5.76.07 7.43.18a1.11 1.11 0 0 1 .91 1.11c.21 4.14.21 8.29 0 12.43Z"/>
</svg>`,rf=e=>{e.setAttribute("aria-checked",ar(e).toString())};class rA extends rc{static get observedAttributes(){return[...super.observedAttributes,tW.MEDIA_SUBTITLES_LIST,tW.MEDIA_SUBTITLES_SHOWING]}connectedCallback(){super.connectedCallback(),this.setAttribute("role","switch"),this.setAttribute("aria-label",ie("closed captions")),rf(this)}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),e===tW.MEDIA_SUBTITLES_SHOWING&&rf(this)}get mediaSubtitlesList(){return ry(this,tW.MEDIA_SUBTITLES_LIST)}set mediaSubtitlesList(e){rT(this,tW.MEDIA_SUBTITLES_LIST,e)}get mediaSubtitlesShowing(){return ry(this,tW.MEDIA_SUBTITLES_SHOWING)}set mediaSubtitlesShowing(e){rT(this,tW.MEDIA_SUBTITLES_SHOWING,e)}handleClick(){this.dispatchEvent(new id.CustomEvent(tN.MEDIA_TOGGLE_SUBTITLES_REQUEST,{composed:!0,bubbles:!0}))}}rA.getSlotTemplateHTML=function(e){return`
    <style>
      :host([aria-checked="true"]) slot[name=off] {
        display: none !important;
      }

      
      :host(:not([aria-checked="true"])) slot[name=on] {
        display: none !important;
      }

      :host([aria-checked="true"]) slot[name=tooltip-enable],
      :host(:not([aria-checked="true"])) slot[name=tooltip-disable] {
        display: none;
      }
    </style>

    <slot name="icon">
      <slot name="on">${rE}</slot>
      <slot name="off">${rg}</slot>
    </slot>
  `},rA.getTooltipContentHTML=function(){return`
    <slot name="tooltip-enable">${ie("Enable captions")}</slot>
    <slot name="tooltip-disable">${ie("Disable captions")}</slot>
  `};let ry=(e,t)=>{let i=e.getAttribute(t);return i?i8(i):[]},rT=(e,t,i)=>{if(!(null==i?void 0:i.length))return void e.removeAttribute(t);let a=ae(i);e.getAttribute(t)!==a&&e.setAttribute(t,a)};id.customElements.get("media-captions-button")||id.customElements.define("media-captions-button",rA);let rk=e=>{let t=e.mediaIsCasting?ie("stop casting"):ie("start casting");e.setAttribute("aria-label",t)};class r_ extends rc{static get observedAttributes(){return[...super.observedAttributes,tW.MEDIA_IS_CASTING,tW.MEDIA_CAST_UNAVAILABLE]}connectedCallback(){super.connectedCallback(),rk(this)}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),e===tW.MEDIA_IS_CASTING&&rk(this)}get mediaIsCasting(){return iL(this,tW.MEDIA_IS_CASTING)}set mediaIsCasting(e){iD(this,tW.MEDIA_IS_CASTING,e)}get mediaCastUnavailable(){return ix(this,tW.MEDIA_CAST_UNAVAILABLE)}set mediaCastUnavailable(e){iN(this,tW.MEDIA_CAST_UNAVAILABLE,e)}handleClick(){let e=this.mediaIsCasting?tN.MEDIA_EXIT_CAST_REQUEST:tN.MEDIA_ENTER_CAST_REQUEST;this.dispatchEvent(new id.CustomEvent(e,{composed:!0,bubbles:!0}))}}r_.getSlotTemplateHTML=function(e){return`
    <style>
      :host([${tW.MEDIA_IS_CASTING}]) slot[name=icon] slot:not([name=exit]) {
        display: none !important;
      }

      
      :host(:not([${tW.MEDIA_IS_CASTING}])) slot[name=icon] slot:not([name=enter]) {
        display: none !important;
      }

      :host([${tW.MEDIA_IS_CASTING}]) slot[name=tooltip-enter],
      :host(:not([${tW.MEDIA_IS_CASTING}])) slot[name=tooltip-exit] {
        display: none;
      }
    </style>

    <slot name="icon">
      <slot name="enter"><svg aria-hidden="true" viewBox="0 0 24 24"><g><path class="cast_caf_icon_arch0" d="M1,18 L1,21 L4,21 C4,19.3 2.66,18 1,18 L1,18 Z"/><path class="cast_caf_icon_arch1" d="M1,14 L1,16 C3.76,16 6,18.2 6,21 L8,21 C8,17.13 4.87,14 1,14 L1,14 Z"/><path class="cast_caf_icon_arch2" d="M1,10 L1,12 C5.97,12 10,16.0 10,21 L12,21 C12,14.92 7.07,10 1,10 L1,10 Z"/><path class="cast_caf_icon_box" d="M21,3 L3,3 C1.9,3 1,3.9 1,5 L1,8 L3,8 L3,5 L21,5 L21,19 L14,19 L14,21 L21,21 C22.1,21 23,20.1 23,19 L23,5 C23,3.9 22.1,3 21,3 L21,3 Z"/></g></svg></slot>
      <slot name="exit"><svg aria-hidden="true" viewBox="0 0 24 24"><g><path class="cast_caf_icon_arch0" d="M1,18 L1,21 L4,21 C4,19.3 2.66,18 1,18 L1,18 Z"/><path class="cast_caf_icon_arch1" d="M1,14 L1,16 C3.76,16 6,18.2 6,21 L8,21 C8,17.13 4.87,14 1,14 L1,14 Z"/><path class="cast_caf_icon_arch2" d="M1,10 L1,12 C5.97,12 10,16.0 10,21 L12,21 C12,14.92 7.07,10 1,10 L1,10 Z"/><path class="cast_caf_icon_box" d="M21,3 L3,3 C1.9,3 1,3.9 1,5 L1,8 L3,8 L3,5 L21,5 L21,19 L14,19 L14,21 L21,21 C22.1,21 23,20.1 23,19 L23,5 C23,3.9 22.1,3 21,3 L21,3 Z"/><path class="cast_caf_icon_boxfill" d="M5,7 L5,8.63 C8,8.6 13.37,14 13.37,17 L19,17 L19,7 Z"/></g></svg></slot>
    </slot>
  `},r_.getTooltipContentHTML=function(){return`
    <slot name="tooltip-enter">${ie("Start casting")}</slot>
    <slot name="tooltip-exit">${ie("Stop casting")}</slot>
  `},id.customElements.get("media-cast-button")||id.customElements.define("media-cast-button",r_);var rw=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},rI=(e,t,i)=>(rw(e,t,"read from private field"),i?i.call(e):t.get(e)),rR=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},rC=(e,t,i,a)=>(rw(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i),rS=(e,t,i)=>(rw(e,t,"access private method"),i);let rM="open";class rL extends id.HTMLElement{constructor(){super(),rR(this,lV),rR(this,lF),rR(this,lG),rR(this,lj),rR(this,lQ),rR(this,lX),rR(this,l$,!1),rR(this,lB,null),rR(this,lH,null),this.addEventListener("invoke",this),this.addEventListener("focusout",this),this.addEventListener("keydown",this)}static get observedAttributes(){return[rM,"anchor"]}get open(){return iL(this,rM)}set open(e){iD(this,rM,e)}handleEvent(e){switch(e.type){case"invoke":rS(this,lj,lZ).call(this,e);break;case"focusout":rS(this,lQ,lz).call(this,e);break;case"keydown":rS(this,lX,lJ).call(this,e)}}connectedCallback(){rS(this,lV,lK).call(this),this.role||(this.role="dialog")}attributeChangedCallback(e,t,i){rS(this,lV,lK).call(this),e===rM&&i!==t&&(this.open?rS(this,lF,lY).call(this):rS(this,lG,lq).call(this))}focus(){rC(this,lB,i_());let e=!this.dispatchEvent(new Event("focus",{composed:!0,cancelable:!0})),t=!this.dispatchEvent(new Event("focusin",{composed:!0,bubbles:!0,cancelable:!0}));if(e||t)return;let i=this.querySelector('[autofocus], [tabindex]:not([tabindex="-1"]), [role="menu"]');null==i||i.focus()}get keysUsed(){return["Escape","Tab"]}}l$=new WeakMap,lB=new WeakMap,lH=new WeakMap,lV=new WeakSet,lK=function(){if(!rI(this,l$)&&(rC(this,l$,!0),!this.shadowRoot)){this.attachShadow(this.constructor.shadowRootOptions);let e=ib(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e),queueMicrotask(()=>{let{style:e}=iR(this.shadowRoot,":host");e.setProperty("transition","display .15s, visibility .15s, opacity .15s ease-in, transform .15s ease-in")})}},lF=new WeakSet,lY=function(){var e;null==(e=rI(this,lH))||e.setAttribute("aria-expanded","true"),this.dispatchEvent(new Event("open",{composed:!0,bubbles:!0})),this.addEventListener("transitionend",()=>this.focus(),{once:!0})},lG=new WeakSet,lq=function(){var e;null==(e=rI(this,lH))||e.setAttribute("aria-expanded","false"),this.dispatchEvent(new Event("close",{composed:!0,bubbles:!0}))},lj=new WeakSet,lZ=function(e){rC(this,lH,e.relatedTarget),iT(this,e.relatedTarget)||(this.open=!this.open)},lQ=new WeakSet,lz=function(e){var t;!iT(this,e.relatedTarget)&&(null==(t=rI(this,lB))||t.focus(),rI(this,lH)&&rI(this,lH)!==e.relatedTarget&&this.open&&(this.open=!1))},lX=new WeakSet,lJ=function(e){var t,i,a,r,n;let{key:s,ctrlKey:o,altKey:l,metaKey:d}=e;o||l||d||this.keysUsed.includes(s)&&(e.preventDefault(),e.stopPropagation(),"Tab"===s?(e.shiftKey?null==(i=null==(t=this.previousElementSibling)?void 0:t.focus)||i.call(t):null==(r=null==(a=this.nextElementSibling)?void 0:a.focus)||r.call(a),this.blur()):"Escape"===s&&(null==(n=rI(this,lB))||n.focus(),this.open=!1))},rL.shadowRootOptions={mode:"open"},rL.getTemplateHTML=function(e){return`
    <style>
      :host {
        font: var(--media-font,
          var(--media-font-weight, normal)
          var(--media-font-size, 14px) /
          var(--media-text-content-height, var(--media-control-height, 24px))
          var(--media-font-family, helvetica neue, segoe ui, roboto, arial, sans-serif));
        color: var(--media-text-color, var(--media-primary-color, rgb(238 238 238)));
        display: var(--media-dialog-display, inline-flex);
        justify-content: center;
        align-items: center;
        
        transition-behavior: allow-discrete;
        visibility: hidden;
        opacity: 0;
        transform: translateY(2px) scale(.99);
        pointer-events: none;
      }

      :host([open]) {
        transition: display .2s, visibility 0s, opacity .2s ease-out, transform .15s ease-out;
        visibility: visible;
        opacity: 1;
        transform: translateY(0) scale(1);
        pointer-events: auto;
      }

      #content {
        display: flex;
        position: relative;
        box-sizing: border-box;
        width: min(320px, 100%);
        word-wrap: break-word;
        max-height: 100%;
        overflow: auto;
        text-align: center;
        line-height: 1.4;
      }
    </style>
    ${this.getSlotTemplateHTML(e)}
  `},rL.getSlotTemplateHTML=function(e){return`
    <slot id="content"></slot>
  `},id.customElements.get("media-chrome-dialog")||id.customElements.define("media-chrome-dialog",rL);var rD=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},rx=(e,t,i)=>(rD(e,t,"read from private field"),i?i.call(e):t.get(e)),rN=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},rO=(e,t,i,a)=>(rD(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i),rP=(e,t,i)=>(rD(e,t,"access private method"),i);class rU extends id.HTMLElement{constructor(){if(super(),rN(this,l7),rN(this,dt),rN(this,da),rN(this,dn),rN(this,dl),rN(this,du),rN(this,dh),rN(this,dp),rN(this,l0,void 0),rN(this,l1,void 0),rN(this,l2,void 0),rN(this,l3,void 0),rN(this,l4,{}),rN(this,l5,[]),rN(this,l9,()=>{if(this.range.matches(":focus-visible")){let{style:e}=iR(this.shadowRoot,":host");e.setProperty("--_focus-visible-box-shadow","var(--_focus-box-shadow)")}}),rN(this,l8,()=>{let{style:e}=iR(this.shadowRoot,":host");e.removeProperty("--_focus-visible-box-shadow")}),rN(this,l6,()=>{let e=this.shadowRoot.querySelector("#segments-clipping");e&&e.parentNode.append(e)}),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);const e=ib(this.attributes),t=this.constructor.getTemplateHTML(e);this.shadowRoot.setHTMLUnsafe?this.shadowRoot.setHTMLUnsafe(t):this.shadowRoot.innerHTML=t}this.container=this.shadowRoot.querySelector("#container"),rO(this,l2,this.shadowRoot.querySelector("#startpoint")),rO(this,l3,this.shadowRoot.querySelector("#endpoint")),this.range=this.shadowRoot.querySelector("#range"),this.appearance=this.shadowRoot.querySelector("#appearance")}static get observedAttributes(){return["disabled","aria-disabled",tO.MEDIA_CONTROLLER]}attributeChangedCallback(e,t,i){var a,r,n,s,o;e===tO.MEDIA_CONTROLLER?(t&&(null==(r=null==(a=rx(this,l0))?void 0:a.unassociateElement)||r.call(a,this),rO(this,l0,null)),i&&this.isConnected&&(rO(this,l0,null==(n=this.getRootNode())?void 0:n.getElementById(i)),null==(o=null==(s=rx(this,l0))?void 0:s.associateElement)||o.call(s,this))):("disabled"===e||"aria-disabled"===e&&t!==i)&&(null==i?(this.range.removeAttribute(e),rP(this,dt,di).call(this)):(this.range.setAttribute(e,i),rP(this,da,dr).call(this)))}connectedCallback(){var e,t,i;let{style:a}=iR(this.shadowRoot,":host");a.setProperty("display",`var(--media-control-display, var(--${this.localName}-display, inline-flex))`),rx(this,l4).pointer=iR(this.shadowRoot,"#pointer"),rx(this,l4).progress=iR(this.shadowRoot,"#progress"),rx(this,l4).thumb=iR(this.shadowRoot,'#thumb, ::slotted([slot="thumb"])'),rx(this,l4).activeSegment=iR(this.shadowRoot,"#segments-clipping rect:nth-child(0)");let r=this.getAttribute(tO.MEDIA_CONTROLLER);r&&(rO(this,l0,null==(e=this.getRootNode())?void 0:e.getElementById(r)),null==(i=null==(t=rx(this,l0))?void 0:t.associateElement)||i.call(t,this)),this.updateBar(),this.shadowRoot.addEventListener("focusin",rx(this,l9)),this.shadowRoot.addEventListener("focusout",rx(this,l8)),rP(this,dt,di).call(this),ip(this.container,rx(this,l6))}disconnectedCallback(){var e,t;rP(this,da,dr).call(this),null==(t=null==(e=rx(this,l0))?void 0:e.unassociateElement)||t.call(e,this),rO(this,l0,null),this.shadowRoot.removeEventListener("focusin",rx(this,l9)),this.shadowRoot.removeEventListener("focusout",rx(this,l8)),iv(this.container,rx(this,l6))}updatePointerBar(e){var t;null==(t=rx(this,l4).pointer)||t.style.setProperty("width",`${100*this.getPointerRatio(e)}%`)}updateBar(){var e,t;let i=100*this.range.valueAsNumber;null==(e=rx(this,l4).progress)||e.style.setProperty("width",`${i}%`),null==(t=rx(this,l4).thumb)||t.style.setProperty("left",`${i}%`)}updateSegments(e){let t=this.shadowRoot.querySelector("#segments-clipping");if(t.textContent="",this.container.classList.toggle("segments",!!(null==e?void 0:e.length)),!(null==e?void 0:e.length))return;let i=[...new Set([+this.range.min,...e.flatMap(e=>[e.start,e.end]),+this.range.max])];rO(this,l5,[...i]);let a=i.pop();for(let[e,r]of i.entries()){let[n,s]=[0===e,e===i.length-1],o=n?"calc(var(--segments-gap) / -1)":`${100*r}%`,l=s?a:i[e+1],d=`calc(${(l-r)*100}%${n||s?"":" - var(--segments-gap)"})`,u=iu.createElementNS("http://www.w3.org/2000/svg","rect"),m=iC(this.shadowRoot,`#segments-clipping rect:nth-child(${e+1})`);m.style.setProperty("x",o),m.style.setProperty("width",d),t.append(u)}}getPointerRatio(e){var t,i,a,r;let n,s,o;return t=e.clientX,i=e.clientY,a=rx(this,l2).getBoundingClientRect(),n=(r=rx(this,l3).getBoundingClientRect()).x-a.x,0==(o=n*n+(s=r.y-a.y)*s)?0:Math.max(0,Math.min(1,((t-a.x)*n+(i-a.y)*s)/o))}get dragging(){return this.hasAttribute("dragging")}handleEvent(e){switch(e.type){case"pointermove":rP(this,dp,dv).call(this,e);break;case"input":this.updateBar();break;case"pointerenter":rP(this,dl,dd).call(this,e);break;case"pointerdown":rP(this,dn,ds).call(this,e);break;case"pointerup":rP(this,du,dm).call(this);break;case"pointerleave":rP(this,dh,dc).call(this)}}get keysUsed(){return["ArrowUp","ArrowRight","ArrowDown","ArrowLeft"]}}l0=new WeakMap,l1=new WeakMap,l2=new WeakMap,l3=new WeakMap,l4=new WeakMap,l5=new WeakMap,l9=new WeakMap,l8=new WeakMap,l6=new WeakMap,l7=new WeakSet,de=function(e){let t=rx(this,l4).activeSegment;if(!t)return;let i=this.getPointerRatio(e),a=rx(this,l5).findIndex((e,t,a)=>{let r=a[t+1];return null!=r&&i>=e&&i<=r}),r=`#segments-clipping rect:nth-child(${a+1})`;t.selectorText==r&&t.style.transform||(t.selectorText=r,t.style.setProperty("transform","var(--media-range-segment-hover-transform, scaleY(2))"))},dt=new WeakSet,di=function(){this.hasAttribute("disabled")||(this.addEventListener("input",this),this.addEventListener("pointerdown",this),this.addEventListener("pointerenter",this))},da=new WeakSet,dr=function(){var e,t;this.removeEventListener("input",this),this.removeEventListener("pointerdown",this),this.removeEventListener("pointerenter",this),null==(e=id.window)||e.removeEventListener("pointerup",this),null==(t=id.window)||t.removeEventListener("pointermove",this)},dn=new WeakSet,ds=function(e){var t;rO(this,l1,e.composedPath().includes(this.range)),null==(t=id.window)||t.addEventListener("pointerup",this)},dl=new WeakSet,dd=function(e){var t;"mouse"!==e.pointerType&&rP(this,dn,ds).call(this,e),this.addEventListener("pointerleave",this),null==(t=id.window)||t.addEventListener("pointermove",this)},du=new WeakSet,dm=function(){var e;null==(e=id.window)||e.removeEventListener("pointerup",this),this.toggleAttribute("dragging",!1),this.range.disabled=this.hasAttribute("disabled")},dh=new WeakSet,dc=function(){var e,t;this.removeEventListener("pointerleave",this),null==(e=id.window)||e.removeEventListener("pointermove",this),this.toggleAttribute("dragging",!1),this.range.disabled=this.hasAttribute("disabled"),null==(t=rx(this,l4).activeSegment)||t.style.removeProperty("transform")},dp=new WeakSet,dv=function(e){("pen"!==e.pointerType||0!==e.buttons)&&(this.toggleAttribute("dragging",1===e.buttons||"mouse"!==e.pointerType),this.updatePointerBar(e),rP(this,l7,de).call(this,e),this.dragging&&("mouse"!==e.pointerType||!rx(this,l1))&&(this.range.disabled=!0,this.range.valueAsNumber=this.getPointerRatio(e),this.range.dispatchEvent(new Event("input",{bubbles:!0,composed:!0}))))},rU.shadowRootOptions={mode:"open"},rU.getTemplateHTML=function(e){return`
    <style>
      :host {
        --_focus-box-shadow: var(--media-focus-box-shadow, inset 0 0 0 2px rgb(27 127 204 / .9));
        --_media-range-padding: var(--media-range-padding, var(--media-control-padding, 10px));

        box-shadow: var(--_focus-visible-box-shadow, none);
        background: var(--media-control-background, var(--media-secondary-color, rgb(20 20 30 / .7)));
        height: calc(var(--media-control-height, 24px) + 2 * var(--_media-range-padding));
        display: inline-flex;
        align-items: center;
        
        vertical-align: middle;
        box-sizing: border-box;
        position: relative;
        width: 100px;
        transition: background .15s linear;
        cursor: var(--media-cursor, pointer);
        pointer-events: auto;
        touch-action: none; 
      }

      
      input[type=range]:focus {
        outline: 0;
      }
      input[type=range]:focus::-webkit-slider-runnable-track {
        outline: 0;
      }

      :host(:hover) {
        background: var(--media-control-hover-background, rgb(50 50 70 / .7));
      }

      #leftgap {
        padding-left: var(--media-range-padding-left, var(--_media-range-padding));
      }

      #rightgap {
        padding-right: var(--media-range-padding-right, var(--_media-range-padding));
      }

      #startpoint,
      #endpoint {
        position: absolute;
      }

      #endpoint {
        right: 0;
      }

      #container {
        
        width: var(--media-range-track-width, 100%);
        transform: translate(var(--media-range-track-translate-x, 0px), var(--media-range-track-translate-y, 0px));
        position: relative;
        height: 100%;
        display: flex;
        align-items: center;
        min-width: 40px;
      }

      #range {
        
        display: var(--media-time-range-hover-display, block);
        bottom: var(--media-time-range-hover-bottom, -7px);
        height: var(--media-time-range-hover-height, max(100% + 7px, 25px));
        width: 100%;
        position: absolute;
        cursor: var(--media-cursor, pointer);

        -webkit-appearance: none; 
        -webkit-tap-highlight-color: transparent;
        background: transparent; 
        margin: 0;
        z-index: 1;
      }

      @media (hover: hover) {
        #range {
          bottom: var(--media-time-range-hover-bottom, -5px);
          height: var(--media-time-range-hover-height, max(100% + 5px, 20px));
        }
      }

      
      
      #range::-webkit-slider-thumb {
        -webkit-appearance: none;
        background: transparent;
        width: .1px;
        height: .1px;
      }

      
      #range::-moz-range-thumb {
        background: transparent;
        border: transparent;
        width: .1px;
        height: .1px;
      }

      #appearance {
        height: var(--media-range-track-height, 4px);
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 100%;
        position: absolute;
        
        will-change: transform;
      }

      #track {
        background: var(--media-range-track-background, rgb(255 255 255 / .2));
        border-radius: var(--media-range-track-border-radius, 1px);
        border: var(--media-range-track-border, none);
        outline: var(--media-range-track-outline);
        outline-offset: var(--media-range-track-outline-offset);
        backdrop-filter: var(--media-range-track-backdrop-filter);
        -webkit-backdrop-filter: var(--media-range-track-backdrop-filter);
        box-shadow: var(--media-range-track-box-shadow, none);
        position: absolute;
        width: 100%;
        height: 100%;
        overflow: hidden;
      }

      #progress,
      #pointer {
        position: absolute;
        height: 100%;
        will-change: width;
      }

      #progress {
        background: var(--media-range-bar-color, var(--media-primary-color, rgb(238 238 238)));
        transition: var(--media-range-track-transition);
      }

      #pointer {
        background: var(--media-range-track-pointer-background);
        border-right: var(--media-range-track-pointer-border-right);
        transition: visibility .25s, opacity .25s;
        visibility: hidden;
        opacity: 0;
      }

      @media (hover: hover) {
        :host(:hover) #pointer {
          transition: visibility .5s, opacity .5s;
          visibility: visible;
          opacity: 1;
        }
      }

      #thumb,
      ::slotted([slot=thumb]) {
        width: var(--media-range-thumb-width, 10px);
        height: var(--media-range-thumb-height, 10px);
        transition: var(--media-range-thumb-transition);
        transform: var(--media-range-thumb-transform, none);
        opacity: var(--media-range-thumb-opacity, 1);
        translate: -50%;
        position: absolute;
        left: 0;
        cursor: var(--media-cursor, pointer);
      }

      #thumb {
        border-radius: var(--media-range-thumb-border-radius, 10px);
        background: var(--media-range-thumb-background, var(--media-primary-color, rgb(238 238 238)));
        box-shadow: var(--media-range-thumb-box-shadow, 1px 1px 1px transparent);
        border: var(--media-range-thumb-border, none);
      }

      :host([disabled]) #thumb {
        background-color: #777;
      }

      .segments #appearance {
        height: var(--media-range-segment-hover-height, 7px);
      }

      #track {
        clip-path: url(#segments-clipping);
      }

      #segments {
        --segments-gap: var(--media-range-segments-gap, 2px);
        position: absolute;
        width: 100%;
        height: 100%;
      }

      #segments-clipping {
        transform: translateX(calc(var(--segments-gap) / 2));
      }

      #segments-clipping:empty {
        display: none;
      }

      #segments-clipping rect {
        height: var(--media-range-track-height, 4px);
        y: calc((var(--media-range-segment-hover-height, 7px) - var(--media-range-track-height, 4px)) / 2);
        transition: var(--media-range-segment-transition, transform .1s ease-in-out);
        transform: var(--media-range-segment-transform, scaleY(1));
        transform-origin: center;
      }
    </style>
    <div id="leftgap"></div>
    <div id="container">
      <div id="startpoint"></div>
      <div id="endpoint"></div>
      <div id="appearance">
        <div id="track" part="track">
          <div id="pointer"></div>
          <div id="progress" part="progress"></div>
        </div>
        <slot name="thumb">
          <div id="thumb" part="thumb"></div>
        </slot>
        <svg id="segments"><clipPath id="segments-clipping"></clipPath></svg>
      </div>
      <input id="range" type="range" min="0" max="1" step="any" value="0">

      ${this.getContainerTemplateHTML(e)}
    </div>
    <div id="rightgap"></div>
  `},rU.getContainerTemplateHTML=function(e){return""},id.customElements.get("media-chrome-range")||id.customElements.define("media-chrome-range",rU);var rW=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},r$=(e,t,i)=>(rW(e,t,"read from private field"),i?i.call(e):t.get(e)),rB=(e,t,i,a)=>(rW(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i);class rH extends id.HTMLElement{constructor(){if(super(),((e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)})(this,db,void 0),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);const e=ib(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e)}}static get observedAttributes(){return[tO.MEDIA_CONTROLLER]}attributeChangedCallback(e,t,i){var a,r,n,s,o;e===tO.MEDIA_CONTROLLER&&(t&&(null==(r=null==(a=r$(this,db))?void 0:a.unassociateElement)||r.call(a,this),rB(this,db,null)),i&&this.isConnected&&(rB(this,db,null==(n=this.getRootNode())?void 0:n.getElementById(i)),null==(o=null==(s=r$(this,db))?void 0:s.associateElement)||o.call(s,this)))}connectedCallback(){var e,t,i;let a=this.getAttribute(tO.MEDIA_CONTROLLER);a&&(rB(this,db,null==(e=this.getRootNode())?void 0:e.getElementById(a)),null==(i=null==(t=r$(this,db))?void 0:t.associateElement)||i.call(t,this))}disconnectedCallback(){var e,t;null==(t=null==(e=r$(this,db))?void 0:e.unassociateElement)||t.call(e,this),rB(this,db,null)}}db=new WeakMap,rH.shadowRootOptions={mode:"open"},rH.getTemplateHTML=function(e){return`
    <style>
      :host {
        
        box-sizing: border-box;
        display: var(--media-control-display, var(--media-control-bar-display, inline-flex));
        color: var(--media-text-color, var(--media-primary-color, rgb(238 238 238)));
        --media-loading-indicator-icon-height: 44px;
      }

      ::slotted(media-time-range),
      ::slotted(media-volume-range) {
        min-height: 100%;
      }

      ::slotted(media-time-range),
      ::slotted(media-clip-selector) {
        flex-grow: 1;
      }

      ::slotted([role="menu"]) {
        position: absolute;
      }
    </style>

    <slot></slot>
  `},id.customElements.get("media-control-bar")||id.customElements.define("media-control-bar",rH);var rV=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},rK=(e,t,i)=>(rV(e,t,"read from private field"),i?i.call(e):t.get(e)),rF=(e,t,i,a)=>(rV(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i);class rY extends id.HTMLElement{constructor(){if(super(),((e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)})(this,dE,void 0),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);const e=ib(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e)}}static get observedAttributes(){return[tO.MEDIA_CONTROLLER]}attributeChangedCallback(e,t,i){var a,r,n,s,o;e===tO.MEDIA_CONTROLLER&&(t&&(null==(r=null==(a=rK(this,dE))?void 0:a.unassociateElement)||r.call(a,this),rF(this,dE,null)),i&&this.isConnected&&(rF(this,dE,null==(n=this.getRootNode())?void 0:n.getElementById(i)),null==(o=null==(s=rK(this,dE))?void 0:s.associateElement)||o.call(s,this)))}connectedCallback(){var e,t,i;let{style:a}=iR(this.shadowRoot,":host");a.setProperty("display",`var(--media-control-display, var(--${this.localName}-display, inline-flex))`);let r=this.getAttribute(tO.MEDIA_CONTROLLER);r&&(rF(this,dE,null==(e=this.getRootNode())?void 0:e.getElementById(r)),null==(i=null==(t=rK(this,dE))?void 0:t.associateElement)||i.call(t,this))}disconnectedCallback(){var e,t;null==(t=null==(e=rK(this,dE))?void 0:e.unassociateElement)||t.call(e,this),rF(this,dE,null)}}dE=new WeakMap,rY.shadowRootOptions={mode:"open"},rY.getTemplateHTML=function(e,t={}){return`
    <style>
      :host {
        font: var(--media-font,
          var(--media-font-weight, normal)
          var(--media-font-size, 14px) /
          var(--media-text-content-height, var(--media-control-height, 24px))
          var(--media-font-family, helvetica neue, segoe ui, roboto, arial, sans-serif));
        color: var(--media-text-color, var(--media-primary-color, rgb(238 238 238)));
        background: var(--media-text-background, var(--media-control-background, var(--media-secondary-color, rgb(20 20 30 / .7))));
        padding: var(--media-control-padding, 10px);
        display: inline-flex;
        justify-content: center;
        align-items: center;
        vertical-align: middle;
        box-sizing: border-box;
        text-align: center;
        pointer-events: auto;
      }

      
      :host(:focus-visible) {
        box-shadow: inset 0 0 0 2px rgb(27 127 204 / .9);
        outline: 0;
      }

      
      :host(:where(:focus)) {
        box-shadow: none;
        outline: 0;
      }
    </style>

    ${this.getSlotTemplateHTML(e,t)}
  `},rY.getSlotTemplateHTML=function(e,t){return`
    <slot></slot>
  `},id.customElements.get("media-text-display")||id.customElements.define("media-text-display",rY);var rG=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},rq=(e,t,i)=>(rG(e,t,"read from private field"),i?i.call(e):t.get(e));class rj extends rY{constructor(){var e;super(),((e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)})(this,dg,void 0),((e,t,i,a)=>(rG(e,t,"write to private field"),a?a.call(e,i):t.set(e,i)))(this,dg,this.shadowRoot.querySelector("slot")),rq(this,dg).textContent=t5(null!=(e=this.mediaDuration)?e:0)}static get observedAttributes(){return[...super.observedAttributes,tW.MEDIA_DURATION]}attributeChangedCallback(e,t,i){e===tW.MEDIA_DURATION&&(rq(this,dg).textContent=t5(+i)),super.attributeChangedCallback(e,t,i)}get mediaDuration(){return iS(this,tW.MEDIA_DURATION)}set mediaDuration(e){iM(this,tW.MEDIA_DURATION,e)}}dg=new WeakMap,rj.getSlotTemplateHTML=function(e,t){return`
    <slot>${t5(t.mediaDuration)}</slot>
  `},id.customElements.get("media-duration-display")||id.customElements.define("media-duration-display",rj);let rZ={2:ie("Network Error"),3:ie("Decode Error"),4:ie("Source Not Supported"),5:ie("Encryption Error")},rQ={2:ie("A network error caused the media download to fail."),3:ie("A media error caused playback to be aborted. The media could be corrupt or your browser does not support this format."),4:ie("An unsupported error occurred. The server or network failed, or your browser does not support this format."),5:ie("The media is encrypted and there are no keys to decrypt it.")},rz=e=>{var t,i;return 1===e.code?null:{title:null!=(t=rZ[e.code])?t:`Error ${e.code}`,message:null!=(i=rQ[e.code])?i:e.message}};var rX=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)};function rJ(e){var t;let{title:i,message:a}=null!=(t=rz(e))?t:{},r="";return i&&(r+=`<slot name="error-${e.code}-title"><h3>${i}</h3></slot>`),a&&(r+=`<slot name="error-${e.code}-message"><p>${a}</p></slot>`),r}let r0=[tW.MEDIA_ERROR_CODE,tW.MEDIA_ERROR_MESSAGE];class r1 extends rL{constructor(){super(...arguments),((e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)})(this,df,null)}static get observedAttributes(){return[...super.observedAttributes,...r0]}formatErrorMessage(e){return this.constructor.formatErrorMessage(e)}attributeChangedCallback(e,t,i){var a;if(super.attributeChangedCallback(e,t,i),!r0.includes(e))return;let r=null!=(a=this.mediaError)?a:{code:this.mediaErrorCode,message:this.mediaErrorMessage};this.open=r.code&&null!==rz(r),this.open&&(this.shadowRoot.querySelector("slot").name=`error-${this.mediaErrorCode}`,this.shadowRoot.querySelector("#content").innerHTML=this.formatErrorMessage(r))}get mediaError(){var e,t;return rX(this,e=df,"read from private field"),t?t.call(this):e.get(this)}set mediaError(e){var t,i;rX(this,t=df,"write to private field"),i?i.call(this,e):t.set(this,e)}get mediaErrorCode(){return iS(this,"mediaerrorcode")}set mediaErrorCode(e){iM(this,"mediaerrorcode",e)}get mediaErrorMessage(){return ix(this,"mediaerrormessage")}set mediaErrorMessage(e){iN(this,"mediaerrormessage",e)}}df=new WeakMap,r1.getSlotTemplateHTML=function(e){return`
    <style>
      :host {
        background: rgb(20 20 30 / .8);
      }

      #content {
        display: block;
        padding: 1.2em 1.5em;
      }

      h3,
      p {
        margin-block: 0 .3em;
      }
    </style>
    <slot name="error-${e.mediaerrorcode}" id="content">
      ${rJ({code:+e.mediaerrorcode,message:e.mediaerrormessage})}
    </slot>
  `},r1.formatErrorMessage=rJ,id.customElements.get("media-error-dialog")||id.customElements.define("media-error-dialog",r1);var r2=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot read from private field");return i?i.call(e):t.get(e)},r3=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)};class r4 extends rL{constructor(){super(...arguments),r3(this,dA,e=>{var t;if(!this.open)return;let i=null==(t=this.shadowRoot)?void 0:t.querySelector("#content");if(!i)return;let a=e.composedPath(),r=a[0]===this||a.includes(this),n=a.includes(i);r&&!n&&(this.open=!1)}),r3(this,dy,e=>{if(!this.open)return;let t=e.shiftKey&&("/"===e.key||"?"===e.key);"Escape"!==e.key&&!t||e.ctrlKey||e.altKey||e.metaKey||(this.open=!1,e.preventDefault(),e.stopPropagation())})}connectedCallback(){super.connectedCallback(),this.open&&(this.addEventListener("click",r2(this,dA)),document.addEventListener("keydown",r2(this,dy)))}disconnectedCallback(){this.removeEventListener("click",r2(this,dA)),document.removeEventListener("keydown",r2(this,dy))}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),"open"===e&&(this.open?(this.addEventListener("click",r2(this,dA)),document.addEventListener("keydown",r2(this,dy))):(this.removeEventListener("click",r2(this,dA)),document.removeEventListener("keydown",r2(this,dy))))}}dA=new WeakMap,dy=new WeakMap,r4.getSlotTemplateHTML=function(e){let t;return`
    <style>
      :host {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 9999;
        background: rgb(20 20 30 / .8);
        backdrop-filter: blur(10px);
      }

      #content {
        display: block;
        width: clamp(400px, 40vw, 700px);
        max-width: 90vw;
        text-align: left;
      }

      h2 {
        margin: 0 0 1.5rem 0;
        font-size: 1.5rem;
        font-weight: 500;
        text-align: center;
      }

      .shortcuts-table {
        width: 100%;
        border-collapse: collapse;
      }

      .shortcuts-table tr {
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }

      .shortcuts-table tr:last-child {
        border-bottom: none;
      }

      .shortcuts-table td {
        padding: 0.75rem 0.5rem;
      }

      .shortcuts-table td:first-child {
        text-align: right;
        padding-right: 1rem;
        width: 40%;
        min-width: 120px;
      }

      .shortcuts-table td:last-child {
        padding-left: 1rem;
      }

      .key {
        display: inline-block;
        background: rgba(255, 255, 255, 0.15);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 4px;
        padding: 0.25rem 0.5rem;
        font-family: 'Courier New', monospace;
        font-size: 0.9rem;
        font-weight: 500;
        min-width: 1.5rem;
        text-align: center;
        margin: 0 0.2rem;
      }

      .description {
        color: rgba(255, 255, 255, 0.9);
        font-size: 0.95rem;
      }

      .key-combo {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 0.3rem;
      }

      .key-separator {
        color: rgba(255, 255, 255, 0.5);
        font-size: 0.9rem;
      }
    </style>
    <slot id="content">
      ${t=[{keys:["Space","k"],description:"Toggle Playback"},{keys:["m"],description:"Toggle mute"},{keys:["f"],description:"Toggle fullscreen"},{keys:["c"],description:"Toggle captions or subtitles, if available"},{keys:["p"],description:"Toggle Picture in Picture"},{keys:["←","j"],description:"Seek back 10s"},{keys:["→","l"],description:"Seek forward 10s"},{keys:["↑"],description:"Turn volume up"},{keys:["↓"],description:"Turn volume down"},{keys:["< (SHIFT+,)"],description:"Decrease playback rate"},{keys:["> (SHIFT+.)"],description:"Increase playback rate"}].map(({keys:e,description:t})=>{let i=e.map((e,t)=>t>0?`<span class="key-separator">or</span><span class="key">${e}</span>`:`<span class="key">${e}</span>`).join("");return`
      <tr>
        <td>
          <div class="key-combo">${i}</div>
        </td>
        <td class="description">${t}</td>
      </tr>
    `}).join(""),`
    <h2>Keyboard Shortcuts</h2>
    <table class="shortcuts-table">${t}</table>
  `}
    </slot>
  `},id.customElements.get("media-keyboard-shortcuts-dialog")||id.customElements.define("media-keyboard-shortcuts-dialog",r4);var r5=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)};let r9=`<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M16 3v2.5h3.5V9H22V3h-6ZM4 9h2.5V5.5H10V3H4v6Zm15.5 9.5H16V21h6v-6h-2.5v3.5ZM6.5 15H4v6h6v-2.5H6.5V15Z"/>
</svg>`,r8=`<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M18.5 6.5V3H16v6h6V6.5h-3.5ZM16 21h2.5v-3.5H22V15h-6v6ZM4 17.5h3.5V21H10v-6H4v2.5Zm3.5-11H4V9h6V3H7.5v3.5Z"/>
</svg>`,r6=e=>{let t=e.mediaIsFullscreen?ie("exit fullscreen mode"):ie("enter fullscreen mode");e.setAttribute("aria-label",t)};class r7 extends rc{constructor(){super(...arguments),((e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)})(this,dT,null)}static get observedAttributes(){return[...super.observedAttributes,tW.MEDIA_IS_FULLSCREEN,tW.MEDIA_FULLSCREEN_UNAVAILABLE]}connectedCallback(){super.connectedCallback(),r6(this)}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),e===tW.MEDIA_IS_FULLSCREEN&&r6(this)}get mediaFullscreenUnavailable(){return ix(this,tW.MEDIA_FULLSCREEN_UNAVAILABLE)}set mediaFullscreenUnavailable(e){iN(this,tW.MEDIA_FULLSCREEN_UNAVAILABLE,e)}get mediaIsFullscreen(){return iL(this,tW.MEDIA_IS_FULLSCREEN)}set mediaIsFullscreen(e){iD(this,tW.MEDIA_IS_FULLSCREEN,e)}handleClick(e){var t,i,a,r;r5(this,t=dT,"write to private field"),i?i.call(this,e):t.set(this,e);let n=(r5(this,a=dT,"read from private field"),(r?r.call(this):a.get(this))instanceof PointerEvent),s=this.mediaIsFullscreen?new id.CustomEvent(tN.MEDIA_EXIT_FULLSCREEN_REQUEST,{composed:!0,bubbles:!0}):new id.CustomEvent(tN.MEDIA_ENTER_FULLSCREEN_REQUEST,{composed:!0,bubbles:!0,detail:n});this.dispatchEvent(s)}}dT=new WeakMap,r7.getSlotTemplateHTML=function(e){return`
    <style>
      :host([${tW.MEDIA_IS_FULLSCREEN}]) slot[name=icon] slot:not([name=exit]) {
        display: none !important;
      }

      
      :host(:not([${tW.MEDIA_IS_FULLSCREEN}])) slot[name=icon] slot:not([name=enter]) {
        display: none !important;
      }

      :host([${tW.MEDIA_IS_FULLSCREEN}]) slot[name=tooltip-enter],
      :host(:not([${tW.MEDIA_IS_FULLSCREEN}])) slot[name=tooltip-exit] {
        display: none;
      }
    </style>

    <slot name="icon">
      <slot name="enter">${r9}</slot>
      <slot name="exit">${r8}</slot>
    </slot>
  `},r7.getTooltipContentHTML=function(){return`
    <slot name="tooltip-enter">${ie("Enter fullscreen mode")}</slot>
    <slot name="tooltip-exit">${ie("Exit fullscreen mode")}</slot>
  `},id.customElements.get("media-fullscreen-button")||id.customElements.define("media-fullscreen-button",r7);let{MEDIA_TIME_IS_LIVE:ne,MEDIA_PAUSED:nt}=tW,{MEDIA_SEEK_TO_LIVE_REQUEST:ni,MEDIA_PLAY_REQUEST:na}=tN,nr=e=>{var t;let i=e.mediaPaused||!e.mediaTimeIsLive,a=i?ie("seek to live"):ie("playing live");e.setAttribute("aria-label",a);let r=null==(t=e.shadowRoot)?void 0:t.querySelector('slot[name="text"]');r&&(r.textContent=ie("live")),i?e.removeAttribute("aria-disabled"):e.setAttribute("aria-disabled","true")};class nn extends rc{static get observedAttributes(){return[...super.observedAttributes,ne,nt]}connectedCallback(){super.connectedCallback(),nr(this)}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),nr(this)}get mediaPaused(){return iL(this,tW.MEDIA_PAUSED)}set mediaPaused(e){iD(this,tW.MEDIA_PAUSED,e)}get mediaTimeIsLive(){return iL(this,tW.MEDIA_TIME_IS_LIVE)}set mediaTimeIsLive(e){iD(this,tW.MEDIA_TIME_IS_LIVE,e)}handleClick(){(this.mediaPaused||!this.mediaTimeIsLive)&&(this.dispatchEvent(new id.CustomEvent(ni,{composed:!0,bubbles:!0})),this.hasAttribute(nt)&&this.dispatchEvent(new id.CustomEvent(na,{composed:!0,bubbles:!0})))}}nn.getSlotTemplateHTML=function(e){return`
    <style>
      :host { --media-tooltip-display: none; }
      
      slot[name=indicator] > *,
      :host ::slotted([slot=indicator]) {
        
        min-width: auto;
        fill: var(--media-live-button-icon-color, rgb(140, 140, 140));
        color: var(--media-live-button-icon-color, rgb(140, 140, 140));
      }

      :host([${ne}]:not([${nt}])) slot[name=indicator] > *,
      :host([${ne}]:not([${nt}])) ::slotted([slot=indicator]) {
        fill: var(--media-live-button-indicator-color, rgb(255, 0, 0));
        color: var(--media-live-button-indicator-color, rgb(255, 0, 0));
      }

      :host([${ne}]:not([${nt}])) {
        cursor: var(--media-cursor, not-allowed);
      }

      slot[name=text]{
        text-transform: uppercase;
      }

    </style>

    <slot name="indicator"><svg viewBox="0 0 6 12"><circle cx="3" cy="6" r="2"></circle></svg></slot>
    
    <slot name="spacer">&nbsp;</slot><slot name="text">${ie("live")}</slot>
  `},id.customElements.get("media-live-button")||id.customElements.define("media-live-button",nn);var ns=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},no=(e,t,i)=>(ns(e,t,"read from private field"),i?i.call(e):t.get(e)),nl=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},nd=(e,t,i,a)=>(ns(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i);let nu="loadingdelay",nm="noautohide",nh=`
<svg aria-hidden="true" viewBox="0 0 100 100">
  <path d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50">
    <animateTransform
       attributeName="transform"
       attributeType="XML"
       type="rotate"
       dur="1s"
       from="0 50 50"
       to="360 50 50"
       repeatCount="indefinite" />
  </path>
</svg>
`;class nc extends id.HTMLElement{constructor(){if(super(),nl(this,dk,void 0),nl(this,d_,500),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);const e=ib(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e)}}static get observedAttributes(){return[tO.MEDIA_CONTROLLER,tW.MEDIA_PAUSED,tW.MEDIA_LOADING,nu]}attributeChangedCallback(e,t,i){var a,r,n,s,o;e===nu&&t!==i?this.loadingDelay=Number(i):e===tO.MEDIA_CONTROLLER&&(t&&(null==(r=null==(a=no(this,dk))?void 0:a.unassociateElement)||r.call(a,this),nd(this,dk,null)),i&&this.isConnected&&(nd(this,dk,null==(n=this.getRootNode())?void 0:n.getElementById(i)),null==(o=null==(s=no(this,dk))?void 0:s.associateElement)||o.call(s,this)))}connectedCallback(){var e,t,i;let a=this.getAttribute(tO.MEDIA_CONTROLLER);a&&(nd(this,dk,null==(e=this.getRootNode())?void 0:e.getElementById(a)),null==(i=null==(t=no(this,dk))?void 0:t.associateElement)||i.call(t,this))}disconnectedCallback(){var e,t;null==(t=null==(e=no(this,dk))?void 0:e.unassociateElement)||t.call(e,this),nd(this,dk,null)}get loadingDelay(){return no(this,d_)}set loadingDelay(e){nd(this,d_,e);let{style:t}=iR(this.shadowRoot,":host");t.setProperty("--_loading-indicator-delay",`var(--media-loading-indicator-transition-delay, ${e}ms)`)}get mediaPaused(){return iL(this,tW.MEDIA_PAUSED)}set mediaPaused(e){iD(this,tW.MEDIA_PAUSED,e)}get mediaLoading(){return iL(this,tW.MEDIA_LOADING)}set mediaLoading(e){iD(this,tW.MEDIA_LOADING,e)}get mediaController(){return ix(this,tO.MEDIA_CONTROLLER)}set mediaController(e){iN(this,tO.MEDIA_CONTROLLER,e)}get noAutohide(){return iL(this,nm)}set noAutohide(e){iD(this,nm,e)}}dk=new WeakMap,d_=new WeakMap,nc.shadowRootOptions={mode:"open"},nc.getTemplateHTML=function(e){return`
    <style>
      :host {
        display: var(--media-control-display, var(--media-loading-indicator-display, inline-block));
        vertical-align: middle;
        box-sizing: border-box;
        --_loading-indicator-delay: var(--media-loading-indicator-transition-delay, 500ms);
      }

      #status {
        color: rgba(0,0,0,0);
        width: 0px;
        height: 0px;
      }

      :host slot[name=icon] > *,
      :host ::slotted([slot=icon]) {
        opacity: var(--media-loading-indicator-opacity, 0);
        transition: opacity 0.15s;
      }

      :host([${tW.MEDIA_LOADING}]:not([${tW.MEDIA_PAUSED}])) slot[name=icon] > *,
      :host([${tW.MEDIA_LOADING}]:not([${tW.MEDIA_PAUSED}])) ::slotted([slot=icon]) {
        opacity: var(--media-loading-indicator-opacity, 1);
        transition: opacity 0.15s var(--_loading-indicator-delay);
      }

      :host #status {
        visibility: var(--media-loading-indicator-opacity, hidden);
        transition: visibility 0.15s;
      }

      :host([${tW.MEDIA_LOADING}]:not([${tW.MEDIA_PAUSED}])) #status {
        visibility: var(--media-loading-indicator-opacity, visible);
        transition: visibility 0.15s var(--_loading-indicator-delay);
      }

      svg, img, ::slotted(svg), ::slotted(img) {
        width: var(--media-loading-indicator-icon-width);
        height: var(--media-loading-indicator-icon-height, 100px);
        fill: var(--media-icon-color, var(--media-primary-color, rgb(238 238 238)));
        vertical-align: middle;
      }
    </style>

    <slot name="icon">${nh}</slot>
    <div id="status" role="status" aria-live="polite">${ie("media loading")}</div>
  `},id.customElements.get("media-loading-indicator")||id.customElements.define("media-loading-indicator",nc);let np=`<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="M16.5 12A4.5 4.5 0 0 0 14 8v2.18l2.45 2.45a4.22 4.22 0 0 0 .05-.63Zm2.5 0a6.84 6.84 0 0 1-.54 2.64L20 16.15A8.8 8.8 0 0 0 21 12a9 9 0 0 0-7-8.77v2.06A7 7 0 0 1 19 12ZM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25A6.92 6.92 0 0 1 14 18.7v2.06A9 9 0 0 0 17.69 19l2 2.05L21 19.73l-9-9L4.27 3ZM12 4 9.91 6.09 12 8.18V4Z"/>
</svg>`,nv=`<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="M3 9v6h4l5 5V4L7 9H3Zm13.5 3A4.5 4.5 0 0 0 14 8v8a4.47 4.47 0 0 0 2.5-4Z"/>
</svg>`,nb=`<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="M3 9v6h4l5 5V4L7 9H3Zm13.5 3A4.5 4.5 0 0 0 14 8v8a4.47 4.47 0 0 0 2.5-4ZM14 3.23v2.06a7 7 0 0 1 0 13.42v2.06a9 9 0 0 0 0-17.54Z"/>
</svg>`,nE=e=>{let t="off"===e.mediaVolumeLevel?ie("unmute"):ie("mute");e.setAttribute("aria-label",t)};class ng extends rc{static get observedAttributes(){return[...super.observedAttributes,tW.MEDIA_VOLUME_LEVEL]}connectedCallback(){super.connectedCallback(),nE(this)}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),e===tW.MEDIA_VOLUME_LEVEL&&nE(this)}get mediaVolumeLevel(){return ix(this,tW.MEDIA_VOLUME_LEVEL)}set mediaVolumeLevel(e){iN(this,tW.MEDIA_VOLUME_LEVEL,e)}handleClick(){let e="off"===this.mediaVolumeLevel?tN.MEDIA_UNMUTE_REQUEST:tN.MEDIA_MUTE_REQUEST;this.dispatchEvent(new id.CustomEvent(e,{composed:!0,bubbles:!0}))}}ng.getSlotTemplateHTML=function(e){return`
    <style>
      :host(:not([${tW.MEDIA_VOLUME_LEVEL}])) slot[name=icon] slot:not([name=high]),
      :host([${tW.MEDIA_VOLUME_LEVEL}=high]) slot[name=icon] slot:not([name=high]) {
        display: none !important;
      }

      :host([${tW.MEDIA_VOLUME_LEVEL}=off]) slot[name=icon] slot:not([name=off]) {
        display: none !important;
      }

      :host([${tW.MEDIA_VOLUME_LEVEL}=low]) slot[name=icon] slot:not([name=low]) {
        display: none !important;
      }

      :host([${tW.MEDIA_VOLUME_LEVEL}=medium]) slot[name=icon] slot:not([name=medium]) {
        display: none !important;
      }

      :host(:not([${tW.MEDIA_VOLUME_LEVEL}=off])) slot[name=tooltip-unmute],
      :host([${tW.MEDIA_VOLUME_LEVEL}=off]) slot[name=tooltip-mute] {
        display: none;
      }
    </style>

    <slot name="icon">
      <slot name="off">${np}</slot>
      <slot name="low">${nv}</slot>
      <slot name="medium">${nv}</slot>
      <slot name="high">${nb}</slot>
    </slot>
  `},ng.getTooltipContentHTML=function(){return`
    <slot name="tooltip-mute">${ie("Mute")}</slot>
    <slot name="tooltip-unmute">${ie("Unmute")}</slot>
  `},id.customElements.get("media-mute-button")||id.customElements.define("media-mute-button",ng);let nf=`<svg aria-hidden="true" viewBox="0 0 28 24">
  <path d="M24 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h20a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1Zm-1 16H5V5h18v14Zm-3-8h-7v5h7v-5Z"/>
</svg>`,nA=e=>{let t=e.mediaIsPip?ie("exit picture in picture mode"):ie("enter picture in picture mode");e.setAttribute("aria-label",t)};class ny extends rc{static get observedAttributes(){return[...super.observedAttributes,tW.MEDIA_IS_PIP,tW.MEDIA_PIP_UNAVAILABLE]}connectedCallback(){super.connectedCallback(),nA(this)}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),e===tW.MEDIA_IS_PIP&&nA(this)}get mediaPipUnavailable(){return ix(this,tW.MEDIA_PIP_UNAVAILABLE)}set mediaPipUnavailable(e){iN(this,tW.MEDIA_PIP_UNAVAILABLE,e)}get mediaIsPip(){return iL(this,tW.MEDIA_IS_PIP)}set mediaIsPip(e){iD(this,tW.MEDIA_IS_PIP,e)}handleClick(){let e=this.mediaIsPip?tN.MEDIA_EXIT_PIP_REQUEST:tN.MEDIA_ENTER_PIP_REQUEST;this.dispatchEvent(new id.CustomEvent(e,{composed:!0,bubbles:!0}))}}ny.getSlotTemplateHTML=function(e){return`
    <style>
      :host([${tW.MEDIA_IS_PIP}]) slot[name=icon] slot:not([name=exit]) {
        display: none !important;
      }

      :host(:not([${tW.MEDIA_IS_PIP}])) slot[name=icon] slot:not([name=enter]) {
        display: none !important;
      }

      :host([${tW.MEDIA_IS_PIP}]) slot[name=tooltip-enter],
      :host(:not([${tW.MEDIA_IS_PIP}])) slot[name=tooltip-exit] {
        display: none;
      }
    </style>

    <slot name="icon">
      <slot name="enter">${nf}</slot>
      <slot name="exit">${nf}</slot>
    </slot>
  `},ny.getTooltipContentHTML=function(){return`
    <slot name="tooltip-enter">${ie("Enter picture in picture mode")}</slot>
    <slot name="tooltip-exit">${ie("Exit picture in picture mode")}</slot>
  `},id.customElements.get("media-pip-button")||id.customElements.define("media-pip-button",ny);var nT=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot read from private field");return i?i.call(e):t.get(e)};let nk="rates",n_=[1,1.2,1.5,1.7,2];class nw extends rc{constructor(){var e;super(),((e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)})(this,dw,new i5(this,nk,{defaultValue:n_})),this.container=this.shadowRoot.querySelector('slot[name="icon"]'),this.container.innerHTML=`${null!=(e=this.mediaPlaybackRate)?e:1}x`}static get observedAttributes(){return[...super.observedAttributes,tW.MEDIA_PLAYBACK_RATE,nk]}attributeChangedCallback(e,t,i){if(super.attributeChangedCallback(e,t,i),e===nk&&(nT(this,dw).value=i),e===tW.MEDIA_PLAYBACK_RATE){let e=i?+i:NaN,t=Number.isNaN(e)?1:e;this.container.innerHTML=`${t}x`,this.setAttribute("aria-label",ie("Playback rate {playbackRate}",{playbackRate:t}))}}get rates(){return nT(this,dw)}set rates(e){e?Array.isArray(e)?nT(this,dw).value=e.join(" "):"string"==typeof e&&(nT(this,dw).value=e):nT(this,dw).value=""}get mediaPlaybackRate(){return iS(this,tW.MEDIA_PLAYBACK_RATE,1)}set mediaPlaybackRate(e){iM(this,tW.MEDIA_PLAYBACK_RATE,e)}handleClick(){var e,t;let i=Array.from(nT(this,dw).values(),e=>+e).sort((e,t)=>e-t),a=null!=(t=null!=(e=i.find(e=>e>this.mediaPlaybackRate))?e:i[0])?t:1,r=new id.CustomEvent(tN.MEDIA_PLAYBACK_RATE_REQUEST,{composed:!0,bubbles:!0,detail:a});this.dispatchEvent(r)}}dw=new WeakMap,nw.getSlotTemplateHTML=function(e){return`
    <style>
      :host {
        min-width: 5ch;
        padding: var(--media-button-padding, var(--media-control-padding, 10px 5px));
      }
    </style>
    <slot name="icon">${e.mediaplaybackrate||1}x</slot>
  `},nw.getTooltipContentHTML=function(){return ie("Playback rate")},id.customElements.get("media-playback-rate-button")||id.customElements.define("media-playback-rate-button",nw);let nI=`<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="m6 21 15-9L6 3v18Z"/>
</svg>`,nR=`<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="M6 20h4V4H6v16Zm8-16v16h4V4h-4Z"/>
</svg>`,nC=e=>{let t=e.mediaPaused?ie("play"):ie("pause");e.setAttribute("aria-label",t)};class nS extends rc{static get observedAttributes(){return[...super.observedAttributes,tW.MEDIA_PAUSED,tW.MEDIA_ENDED]}connectedCallback(){super.connectedCallback(),nC(this)}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),(e===tW.MEDIA_PAUSED||e===tW.MEDIA_LANG)&&nC(this)}get mediaPaused(){return iL(this,tW.MEDIA_PAUSED)}set mediaPaused(e){iD(this,tW.MEDIA_PAUSED,e)}handleClick(){let e=this.mediaPaused?tN.MEDIA_PLAY_REQUEST:tN.MEDIA_PAUSE_REQUEST;this.dispatchEvent(new id.CustomEvent(e,{composed:!0,bubbles:!0}))}}nS.getSlotTemplateHTML=function(e){return`
    <style>
      :host([${tW.MEDIA_PAUSED}]) slot[name=pause],
      :host(:not([${tW.MEDIA_PAUSED}])) slot[name=play] {
        display: none !important;
      }

      :host([${tW.MEDIA_PAUSED}]) slot[name=tooltip-pause],
      :host(:not([${tW.MEDIA_PAUSED}])) slot[name=tooltip-play] {
        display: none;
      }
    </style>

    <slot name="icon">
      <slot name="play">${nI}</slot>
      <slot name="pause">${nR}</slot>
    </slot>
  `},nS.getTooltipContentHTML=function(){return`
    <slot name="tooltip-play">${ie("Play")}</slot>
    <slot name="tooltip-pause">${ie("Pause")}</slot>
  `},id.customElements.get("media-play-button")||id.customElements.define("media-play-button",nS);let nM="placeholdersrc";class nL extends id.HTMLElement{static get observedAttributes(){return[nM,"src"]}constructor(){if(super(),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);const e=ib(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e)}this.image=this.shadowRoot.querySelector("#image")}attributeChangedCallback(e,t,i){if("src"===e&&(null==i?this.image.removeAttribute("src"):this.image.setAttribute("src",i)),e===nM)if(null==i)this.image.style.removeProperty("background-image");else{var a;a=this.image,a.style["background-image"]=`url('${i}')`}}get placeholderSrc(){return ix(this,nM)}set placeholderSrc(e){iN(this,"src",e)}get src(){return ix(this,"src")}set src(e){iN(this,"src",e)}}nL.shadowRootOptions={mode:"open"},nL.getTemplateHTML=function(e){return`
    <style>
      :host {
        pointer-events: none;
        display: var(--media-poster-image-display, inline-block);
        box-sizing: border-box;
      }

      img {
        max-width: 100%;
        max-height: 100%;
        min-width: 100%;
        min-height: 100%;
        background-repeat: no-repeat;
        background-position: var(--media-poster-image-background-position, var(--media-object-position, center));
        background-size: var(--media-poster-image-background-size, var(--media-object-fit, contain));
        object-fit: var(--media-object-fit, contain);
        object-position: var(--media-object-position, center);
      }
    </style>

    <img part="poster img" aria-hidden="true" id="image"/>
  `},id.customElements.get("media-poster-image")||id.customElements.define("media-poster-image",nL);var nD=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)};dI=new WeakMap,id.customElements.get("media-preview-chapter-display")||id.customElements.define("media-preview-chapter-display",class extends rY{constructor(){super(),((e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)})(this,dI,void 0),((e,t,i,a)=>(nD(e,t,"write to private field"),a?a.call(e,i):t.set(e,i)))(this,dI,this.shadowRoot.querySelector("slot"))}static get observedAttributes(){return[...super.observedAttributes,tW.MEDIA_PREVIEW_CHAPTER,tW.MEDIA_LANG]}attributeChangedCallback(e,t,i){if(super.attributeChangedCallback(e,t,i),(e===tW.MEDIA_PREVIEW_CHAPTER||e===tW.MEDIA_LANG)&&i!==t&&null!=i){var a;if((nD(this,dI,"read from private field"),a?a.call(this):dI.get(this)).textContent=i,""!==i){let e=ie("chapter: {chapterName}",{chapterName:i});this.setAttribute("aria-valuetext",e)}else this.removeAttribute("aria-valuetext")}}get mediaPreviewChapter(){return ix(this,tW.MEDIA_PREVIEW_CHAPTER)}set mediaPreviewChapter(e){iN(this,tW.MEDIA_PREVIEW_CHAPTER,e)}});var nx=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},nN=(e,t,i)=>(nx(e,t,"read from private field"),i?i.call(e):t.get(e)),nO=(e,t,i,a)=>(nx(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i);class nP extends id.HTMLElement{constructor(){if(super(),((e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)})(this,dR,void 0),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);const e=ib(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e)}}static get observedAttributes(){return[tO.MEDIA_CONTROLLER,tW.MEDIA_PREVIEW_IMAGE,tW.MEDIA_PREVIEW_COORDS]}connectedCallback(){var e,t,i;let a=this.getAttribute(tO.MEDIA_CONTROLLER);a&&(nO(this,dR,null==(e=this.getRootNode())?void 0:e.getElementById(a)),null==(i=null==(t=nN(this,dR))?void 0:t.associateElement)||i.call(t,this))}disconnectedCallback(){var e,t;null==(t=null==(e=nN(this,dR))?void 0:e.unassociateElement)||t.call(e,this),nO(this,dR,null)}attributeChangedCallback(e,t,i){var a,r,n,s,o;[tW.MEDIA_PREVIEW_IMAGE,tW.MEDIA_PREVIEW_COORDS].includes(e)&&this.update(),e===tO.MEDIA_CONTROLLER&&(t&&(null==(r=null==(a=nN(this,dR))?void 0:a.unassociateElement)||r.call(a,this),nO(this,dR,null)),i&&this.isConnected&&(nO(this,dR,null==(n=this.getRootNode())?void 0:n.getElementById(i)),null==(o=null==(s=nN(this,dR))?void 0:s.associateElement)||o.call(s,this)))}get mediaPreviewImage(){return ix(this,tW.MEDIA_PREVIEW_IMAGE)}set mediaPreviewImage(e){iN(this,tW.MEDIA_PREVIEW_IMAGE,e)}get mediaPreviewCoords(){let e=this.getAttribute(tW.MEDIA_PREVIEW_COORDS);if(e)return e.split(/\s+/).map(e=>+e)}set mediaPreviewCoords(e){e?this.setAttribute(tW.MEDIA_PREVIEW_COORDS,e.join(" ")):this.removeAttribute(tW.MEDIA_PREVIEW_COORDS)}update(){let e=this.mediaPreviewCoords,t=this.mediaPreviewImage;if(!(e&&t))return;let[i,a,r,n]=e,s=t.split("#")[0],{maxWidth:o,maxHeight:l,minWidth:d,minHeight:u}=getComputedStyle(this),m=Math.min(parseInt(o)/r,parseInt(l)/n),h=Math.max(parseInt(d)/r,parseInt(u)/n),c=m<1,p=c?m:h>1?h:1,{style:v}=iR(this.shadowRoot,":host"),b=iR(this.shadowRoot,"img").style,E=this.shadowRoot.querySelector("img"),g=c?"min":"max";v.setProperty(`${g}-width`,"initial","important"),v.setProperty(`${g}-height`,"initial","important"),v.width=`${r*p}px`,v.height=`${n*p}px`;let f=()=>{b.width=`${this.imgWidth*p}px`,b.height=`${this.imgHeight*p}px`,b.display="block"};E.src!==s&&(E.onload=()=>{this.imgWidth=E.naturalWidth,this.imgHeight=E.naturalHeight,f()},E.src=s,f()),f(),b.transform=`translate(-${i*p}px, -${a*p}px)`}}dR=new WeakMap,nP.shadowRootOptions={mode:"open"},nP.getTemplateHTML=function(e){return`
    <style>
      :host {
        box-sizing: border-box;
        display: var(--media-control-display, var(--media-preview-thumbnail-display, inline-block));
        overflow: hidden;
      }

      img {
        display: none;
        position: relative;
      }
    </style>
    <img crossorigin loading="eager" decoding="async">
  `},id.customElements.get("media-preview-thumbnail")||id.customElements.define("media-preview-thumbnail",nP);var nU=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},nW=(e,t,i)=>(nU(e,t,"read from private field"),i?i.call(e):t.get(e));dC=new WeakMap,id.customElements.get("media-preview-time-display")||id.customElements.define("media-preview-time-display",class extends rY{constructor(){super(),((e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)})(this,dC,void 0),((e,t,i,a)=>(nU(e,t,"write to private field"),a?a.call(e,i):t.set(e,i)))(this,dC,this.shadowRoot.querySelector("slot")),nW(this,dC).textContent=t5(0)}static get observedAttributes(){return[...super.observedAttributes,tW.MEDIA_PREVIEW_TIME]}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),e===tW.MEDIA_PREVIEW_TIME&&null!=i&&(nW(this,dC).textContent=t5(parseFloat(i)))}get mediaPreviewTime(){return iS(this,tW.MEDIA_PREVIEW_TIME)}set mediaPreviewTime(e){iM(this,tW.MEDIA_PREVIEW_TIME,e)}});let n$="seekoffset";class nB extends rc{static get observedAttributes(){return[...super.observedAttributes,tW.MEDIA_CURRENT_TIME,n$]}connectedCallback(){super.connectedCallback(),this.seekOffset=iS(this,n$,30)}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),e===n$&&(this.seekOffset=iS(this,n$,30))}get seekOffset(){return iS(this,n$,30)}set seekOffset(e){iM(this,n$,e),this.setAttribute("aria-label",ie("seek back {seekOffset} seconds",{seekOffset:this.seekOffset})),iA(iy(this,"icon"),this.seekOffset)}get mediaCurrentTime(){return iS(this,tW.MEDIA_CURRENT_TIME,0)}set mediaCurrentTime(e){iM(this,tW.MEDIA_CURRENT_TIME,e)}handleClick(){let e=Math.max(this.mediaCurrentTime-this.seekOffset,0),t=new id.CustomEvent(tN.MEDIA_SEEK_REQUEST,{composed:!0,bubbles:!0,detail:e});this.dispatchEvent(t)}}nB.getSlotTemplateHTML=function(e,t){let i;return`
    <slot name="icon">${i=t.seekOffset,`
  <svg aria-hidden="true" viewBox="0 0 20 24">
    <defs>
      <style>.text{font-size:8px;font-family:Arial-BoldMT, Arial;font-weight:700;}</style>
    </defs>
    <text class="text value" transform="translate(2.18 19.87)">${i}</text>
    <path d="M10 6V3L4.37 7 10 10.94V8a5.54 5.54 0 0 1 1.9 10.48v2.12A7.5 7.5 0 0 0 10 6Z"/>
  </svg>`}</slot>
  `},nB.getTooltipContentHTML=function(){return ie("Seek backward")},id.customElements.get("media-seek-backward-button")||id.customElements.define("media-seek-backward-button",nB);let nH="seekoffset";class nV extends rc{static get observedAttributes(){return[...super.observedAttributes,tW.MEDIA_CURRENT_TIME,nH]}connectedCallback(){super.connectedCallback(),this.seekOffset=iS(this,nH,30)}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),e===nH&&(this.seekOffset=iS(this,nH,30))}get seekOffset(){return iS(this,nH,30)}set seekOffset(e){iM(this,nH,e),this.setAttribute("aria-label",ie("seek forward {seekOffset} seconds",{seekOffset:this.seekOffset})),iA(iy(this,"icon"),this.seekOffset)}get mediaCurrentTime(){return iS(this,tW.MEDIA_CURRENT_TIME,0)}set mediaCurrentTime(e){iM(this,tW.MEDIA_CURRENT_TIME,e)}handleClick(){let e=this.mediaCurrentTime+this.seekOffset,t=new id.CustomEvent(tN.MEDIA_SEEK_REQUEST,{composed:!0,bubbles:!0,detail:e});this.dispatchEvent(t)}}nV.getSlotTemplateHTML=function(e,t){let i;return`
    <slot name="icon">${i=t.seekOffset,`
  <svg aria-hidden="true" viewBox="0 0 20 24">
    <defs>
      <style>.text{font-size:8px;font-family:Arial-BoldMT, Arial;font-weight:700;}</style>
    </defs>
    <text class="text value" transform="translate(8.9 19.87)">${i}</text>
    <path d="M10 6V3l5.61 4L10 10.94V8a5.54 5.54 0 0 0-1.9 10.48v2.12A7.5 7.5 0 0 1 10 6Z"/>
  </svg>`}</slot>
  `},nV.getTooltipContentHTML=function(){return ie("Seek forward")},id.customElements.get("media-seek-forward-button")||id.customElements.define("media-seek-forward-button",nV);var nK=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},nF=(e,t,i)=>(nK(e,t,"read from private field"),i?i.call(e):t.get(e));let nY={REMAINING:"remaining",SHOW_DURATION:"showduration",NO_TOGGLE:"notoggle"},nG=[...Object.values(nY),tW.MEDIA_CURRENT_TIME,tW.MEDIA_DURATION,tW.MEDIA_SEEKABLE],nq=["Enter"," "],nj="&nbsp;/&nbsp;",nZ=(e,{timesSep:t=nj}={})=>{var i,a;let r=null!=(i=e.mediaCurrentTime)?i:0,[,n]=null!=(a=e.mediaSeekable)?a:[],s=0;Number.isFinite(e.mediaDuration)?s=e.mediaDuration:Number.isFinite(n)&&(s=n);let o=e.remaining?t5(0-(s-r)):t5(r);return e.showDuration?`${o}${t}${t5(s)}`:o};class nQ extends rY{constructor(){super(),((e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)})(this,dS,void 0),((e,t,i,a)=>(nK(e,t,"write to private field"),a?a.call(e,i):t.set(e,i)))(this,dS,this.shadowRoot.querySelector("slot")),nF(this,dS).innerHTML=`${nZ(this)}`}static get observedAttributes(){return[...super.observedAttributes,...nG,"disabled"]}connectedCallback(){let{style:e}=iR(this.shadowRoot,":host(:hover:not([notoggle]))");e.setProperty("cursor","var(--media-cursor, pointer)"),e.setProperty("background","var(--media-control-hover-background, rgba(50 50 70 / .7))"),this.hasAttribute("disabled")||this.enable(),this.setAttribute("role","progressbar"),this.setAttribute("aria-label",ie("playback time"));let t=e=>{let{key:i}=e;nq.includes(i)?this.toggleTimeDisplay():this.removeEventListener("keyup",t)};this.addEventListener("keydown",e=>{let{metaKey:i,altKey:a,key:r}=e;i||a||!nq.includes(r)?this.removeEventListener("keyup",t):this.addEventListener("keyup",t)}),this.addEventListener("click",this.toggleTimeDisplay),super.connectedCallback()}toggleTimeDisplay(){this.noToggle||(this.hasAttribute("remaining")?this.removeAttribute("remaining"):this.setAttribute("remaining",""))}disconnectedCallback(){this.disable(),super.disconnectedCallback()}attributeChangedCallback(e,t,i){nG.includes(e)?this.update():"disabled"===e&&i!==t&&(null==i?this.enable():this.disable()),super.attributeChangedCallback(e,t,i)}enable(){this.tabIndex=0}disable(){this.tabIndex=-1}get remaining(){return iL(this,nY.REMAINING)}set remaining(e){iD(this,nY.REMAINING,e)}get showDuration(){return iL(this,nY.SHOW_DURATION)}set showDuration(e){iD(this,nY.SHOW_DURATION,e)}get noToggle(){return iL(this,nY.NO_TOGGLE)}set noToggle(e){iD(this,nY.NO_TOGGLE,e)}get mediaDuration(){return iS(this,tW.MEDIA_DURATION)}set mediaDuration(e){iM(this,tW.MEDIA_DURATION,e)}get mediaCurrentTime(){return iS(this,tW.MEDIA_CURRENT_TIME)}set mediaCurrentTime(e){iM(this,tW.MEDIA_CURRENT_TIME,e)}get mediaSeekable(){let e=this.getAttribute(tW.MEDIA_SEEKABLE);if(e)return e.split(":").map(e=>+e)}set mediaSeekable(e){null==e?this.removeAttribute(tW.MEDIA_SEEKABLE):this.setAttribute(tW.MEDIA_SEEKABLE,e.join(":"))}update(){let e=nZ(this);(e=>{var t;let i=e.mediaCurrentTime,[,a]=null!=(t=e.mediaSeekable)?t:[],r=null;if(Number.isFinite(e.mediaDuration)?r=e.mediaDuration:Number.isFinite(a)&&(r=a),null==i||null===r)return e.setAttribute("aria-valuetext","video not loaded, unknown time.");let n=e.remaining?t4(0-(r-i)):t4(i);if(!e.showDuration)return e.setAttribute("aria-valuetext",n);let s=t4(r),o=`${n} of ${s}`;e.setAttribute("aria-valuetext",o)})(this),e!==nF(this,dS).innerHTML&&(nF(this,dS).innerHTML=e)}}dS=new WeakMap,nQ.getSlotTemplateHTML=function(e,t){return`
    <slot>${nZ(t)}</slot>
  `},id.customElements.get("media-time-display")||id.customElements.define("media-time-display",nQ);var nz=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},nX=(e,t,i)=>(nz(e,t,"read from private field"),i?i.call(e):t.get(e)),nJ=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},n0=(e,t,i,a)=>(nz(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i);class n1{constructor(e,t,i){nJ(this,dM,void 0),nJ(this,dL,void 0),nJ(this,dD,void 0),nJ(this,dx,void 0),nJ(this,dN,void 0),nJ(this,dO,void 0),nJ(this,dP,void 0),nJ(this,dU,void 0),nJ(this,dW,0),nJ(this,d$,(e=performance.now())=>{n0(this,dW,requestAnimationFrame(nX(this,d$))),n0(this,dx,performance.now()-nX(this,dD));let t=1e3/this.fps;if(nX(this,dx)>t){let i,a,r,n;n0(this,dD,e-nX(this,dx)%t);let s=1e3/((e-nX(this,dL))/++(i=this,a=dN,{set _(value){n0(i,a,value,r)},get _(){return nX(i,a,n)}})._),o=(e-nX(this,dO))/1e3/this.duration,l=nX(this,dP)+o*this.playbackRate;l-nX(this,dM).valueAsNumber>0?n0(this,dU,this.playbackRate/this.duration/s):(n0(this,dU,.995*nX(this,dU)),l=nX(this,dM).valueAsNumber+nX(this,dU)),this.callback(l)}}),n0(this,dM,e),this.callback=t,this.fps=i}start(){0===nX(this,dW)&&(n0(this,dD,performance.now()),n0(this,dL,nX(this,dD)),n0(this,dN,0),nX(this,d$).call(this))}stop(){0!==nX(this,dW)&&(cancelAnimationFrame(nX(this,dW)),n0(this,dW,0))}update({start:e,duration:t,playbackRate:i}){let a=e-nX(this,dM).valueAsNumber,r=Math.abs(t-this.duration);(a>0||a<-.03||r>=.5)&&this.callback(e),n0(this,dP,e),n0(this,dO,performance.now()),this.duration=t,this.playbackRate=i}}dM=new WeakMap,dL=new WeakMap,dD=new WeakMap,dx=new WeakMap,dN=new WeakMap,dO=new WeakMap,dP=new WeakMap,dU=new WeakMap,dW=new WeakMap,d$=new WeakMap;var n2=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},n3=(e,t,i)=>(n2(e,t,"read from private field"),i?i.call(e):t.get(e)),n4=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},n5=(e,t,i,a)=>(n2(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i),n9=(e,t,i)=>(n2(e,t,"access private method"),i);let n8=(e,t=e.mediaCurrentTime)=>{let i=Number.isFinite(e.mediaSeekableStart)?e.mediaSeekableStart:0,a=Number.isFinite(e.mediaDuration)?e.mediaDuration:e.mediaSeekableEnd;return Number.isNaN(a)?0:Math.max(0,Math.min((t-i)/(a-i),1))},n6=(e,t=e.range.valueAsNumber)=>{let i=Number.isFinite(e.mediaSeekableStart)?e.mediaSeekableStart:0,a=Number.isFinite(e.mediaDuration)?e.mediaDuration:e.mediaSeekableEnd;return Number.isNaN(a)?0:t*(a-i)+i};class n7 extends rU{constructor(){super(),n4(this,dQ),n4(this,dX),n4(this,d1),n4(this,d3),n4(this,d5),n4(this,d8),n4(this,d7),n4(this,ut),n4(this,dB,void 0),n4(this,dH,void 0),n4(this,dV,void 0),n4(this,dK,void 0),n4(this,dF,void 0),n4(this,dY,void 0),n4(this,dG,void 0),n4(this,dq,void 0),n4(this,dj,void 0),n4(this,dZ,void 0),n4(this,d0,e=>{!this.dragging&&(t0(e)&&(this.range.valueAsNumber=e),n3(this,dZ)||this.updateBar())}),this.shadowRoot.querySelector("#track").insertAdjacentHTML("afterbegin",'<div id="buffered" part="buffered"></div>'),n5(this,dV,this.shadowRoot.querySelectorAll('[part~="box"]')),n5(this,dF,this.shadowRoot.querySelector('[part~="preview-box"]')),n5(this,dY,this.shadowRoot.querySelector('[part~="current-box"]'));const e=getComputedStyle(this);n5(this,dG,parseInt(e.getPropertyValue("--media-box-padding-left"))),n5(this,dq,parseInt(e.getPropertyValue("--media-box-padding-right"))),n5(this,dH,new n1(this.range,n3(this,d0),60))}static get observedAttributes(){return[...super.observedAttributes,tW.MEDIA_PAUSED,tW.MEDIA_DURATION,tW.MEDIA_SEEKABLE,tW.MEDIA_CURRENT_TIME,tW.MEDIA_PREVIEW_IMAGE,tW.MEDIA_PREVIEW_TIME,tW.MEDIA_PREVIEW_CHAPTER,tW.MEDIA_BUFFERED,tW.MEDIA_PLAYBACK_RATE,tW.MEDIA_LOADING,tW.MEDIA_ENDED]}connectedCallback(){var e;super.connectedCallback(),this.range.setAttribute("aria-label",ie("seek")),n9(this,dQ,dz).call(this),n5(this,dB,this.getRootNode()),null==(e=n3(this,dB))||e.addEventListener("transitionstart",this)}disconnectedCallback(){var e;super.disconnectedCallback(),n9(this,dQ,dz).call(this),null==(e=n3(this,dB))||e.removeEventListener("transitionstart",this),n5(this,dB,null)}attributeChangedCallback(e,t,i){if(super.attributeChangedCallback(e,t,i),t!=i){if(e===tW.MEDIA_CURRENT_TIME||e===tW.MEDIA_PAUSED||e===tW.MEDIA_ENDED||e===tW.MEDIA_LOADING||e===tW.MEDIA_DURATION||e===tW.MEDIA_SEEKABLE){let e,t,i,a;n3(this,dH).update({start:n8(this),duration:this.mediaSeekableEnd-this.mediaSeekableStart,playbackRate:this.mediaPlaybackRate}),n9(this,dQ,dz).call(this),e=this.range,t=t4(+n6(this)),i=t4(+this.mediaSeekableEnd),a=t&&i?`${t} of ${i}`:"video not loaded, unknown time.",e.setAttribute("aria-valuetext",a)}else e===tW.MEDIA_BUFFERED&&this.updateBufferedBar();(e===tW.MEDIA_DURATION||e===tW.MEDIA_SEEKABLE)&&(this.mediaChaptersCues=n3(this,dj),this.updateBar())}}get mediaChaptersCues(){return n3(this,dj)}set mediaChaptersCues(e){var t;n5(this,dj,e),this.updateSegments(null==(t=n3(this,dj))?void 0:t.map(e=>({start:n8(this,e.startTime),end:n8(this,e.endTime)})))}get mediaPaused(){return iL(this,tW.MEDIA_PAUSED)}set mediaPaused(e){iD(this,tW.MEDIA_PAUSED,e)}get mediaLoading(){return iL(this,tW.MEDIA_LOADING)}set mediaLoading(e){iD(this,tW.MEDIA_LOADING,e)}get mediaDuration(){return iS(this,tW.MEDIA_DURATION)}set mediaDuration(e){iM(this,tW.MEDIA_DURATION,e)}get mediaCurrentTime(){return iS(this,tW.MEDIA_CURRENT_TIME)}set mediaCurrentTime(e){iM(this,tW.MEDIA_CURRENT_TIME,e)}get mediaPlaybackRate(){return iS(this,tW.MEDIA_PLAYBACK_RATE,1)}set mediaPlaybackRate(e){iM(this,tW.MEDIA_PLAYBACK_RATE,e)}get mediaBuffered(){let e=this.getAttribute(tW.MEDIA_BUFFERED);return e?e.split(" ").map(e=>e.split(":").map(e=>+e)):[]}set mediaBuffered(e){if(!e)return void this.removeAttribute(tW.MEDIA_BUFFERED);let t=e.map(e=>e.join(":")).join(" ");this.setAttribute(tW.MEDIA_BUFFERED,t)}get mediaSeekable(){let e=this.getAttribute(tW.MEDIA_SEEKABLE);if(e)return e.split(":").map(e=>+e)}set mediaSeekable(e){null==e?this.removeAttribute(tW.MEDIA_SEEKABLE):this.setAttribute(tW.MEDIA_SEEKABLE,e.join(":"))}get mediaSeekableEnd(){var e;let[,t=this.mediaDuration]=null!=(e=this.mediaSeekable)?e:[];return t}get mediaSeekableStart(){var e;let[t=0]=null!=(e=this.mediaSeekable)?e:[];return t}get mediaPreviewImage(){return ix(this,tW.MEDIA_PREVIEW_IMAGE)}set mediaPreviewImage(e){iN(this,tW.MEDIA_PREVIEW_IMAGE,e)}get mediaPreviewTime(){return iS(this,tW.MEDIA_PREVIEW_TIME)}set mediaPreviewTime(e){iM(this,tW.MEDIA_PREVIEW_TIME,e)}get mediaEnded(){return iL(this,tW.MEDIA_ENDED)}set mediaEnded(e){iD(this,tW.MEDIA_ENDED,e)}updateBar(){super.updateBar(),this.updateBufferedBar(),this.updateCurrentBox()}updateBufferedBar(){var e;let t,i=this.mediaBuffered;if(!i.length)return;if(this.mediaEnded)t=1;else{let a=this.mediaCurrentTime,[,r=this.mediaSeekableStart]=null!=(e=i.find(([e,t])=>e<=a&&a<=t))?e:[];t=n8(this,r)}let{style:a}=iR(this.shadowRoot,"#buffered");a.setProperty("width",`${100*t}%`)}updateCurrentBox(){if(!this.shadowRoot.querySelector('slot[name="current"]').assignedElements().length)return;let e=iR(this.shadowRoot,"#current-rail"),t=iR(this.shadowRoot,'[part~="current-box"]'),i=n9(this,d1,d2).call(this,n3(this,dY)),a=n9(this,d3,d4).call(this,i,this.range.valueAsNumber),r=n9(this,d5,d9).call(this,i,this.range.valueAsNumber);e.style.transform=`translateX(${a})`,e.style.setProperty("--_range-width",`${i.range.width}`),t.style.setProperty("--_box-shift",`${r}`),t.style.setProperty("--_box-width",`${i.box.width}px`),t.style.setProperty("visibility","initial")}handleEvent(e){switch(super.handleEvent(e),e.type){case"input":n9(this,ut,ui).call(this);break;case"pointermove":n9(this,d8,d6).call(this,e);break;case"pointerup":n3(this,dZ)&&n5(this,dZ,!1);break;case"pointerdown":n5(this,dZ,!0);break;case"pointerleave":n9(this,d7,ue).call(this,null);break;case"transitionstart":iT(e.target,this)&&setTimeout(()=>n9(this,dQ,dz).call(this),0)}}}dB=new WeakMap,dH=new WeakMap,dV=new WeakMap,dK=new WeakMap,dF=new WeakMap,dY=new WeakMap,dG=new WeakMap,dq=new WeakMap,dj=new WeakMap,dZ=new WeakMap,dQ=new WeakSet,dz=function(){n9(this,dX,dJ).call(this)?n3(this,dH).start():n3(this,dH).stop()},dX=new WeakSet,dJ=function(){return this.isConnected&&!this.mediaPaused&&!this.mediaLoading&&!this.mediaEnded&&this.mediaSeekableEnd>0&&iI(this)},d0=new WeakMap,d1=new WeakSet,d2=function(e){var t;let i=(null!=(t=this.getAttribute("bounds")?ik(this,`#${this.getAttribute("bounds")}`):this.parentElement)?t:this).getBoundingClientRect(),a=this.range.getBoundingClientRect(),r=e.offsetWidth,n=-(a.left-i.left-r/2),s=i.right-a.left-r/2;return{box:{width:r,min:n,max:s},bounds:i,range:a}},d3=new WeakSet,d4=function(e,t){let i=`${100*t}%`,{width:a,min:r,max:n}=e.box;if(!a)return i;if(!Number.isNaN(r)){let e=`calc(1 / var(--_range-width) * 100 * ${r}% + var(--media-box-padding-left))`;i=`max(${e}, ${i})`}if(!Number.isNaN(n)){let e=`calc(1 / var(--_range-width) * 100 * ${n}% - var(--media-box-padding-right))`;i=`min(${i}, ${e})`}return i},d5=new WeakSet,d9=function(e,t){let{width:i,min:a,max:r}=e.box,n=t*e.range.width;if(n<a+n3(this,dG)){let t=e.range.left-e.bounds.left-n3(this,dG);return`${n-i/2+t}px`}if(n>r-n3(this,dq)){let t=e.bounds.right-e.range.right-n3(this,dq);return`${n+i/2-t-e.range.width}px`}return 0},d8=new WeakSet,d6=function(e){let t=[...n3(this,dV)].some(t=>e.composedPath().includes(t));if(!this.dragging&&(t||!e.composedPath().includes(this)))return void n9(this,d7,ue).call(this,null);let i=this.mediaSeekableEnd;if(!i)return;let a=iR(this.shadowRoot,"#preview-rail"),r=iR(this.shadowRoot,'[part~="preview-box"]'),n=n9(this,d1,d2).call(this,n3(this,dF)),s=(e.clientX-n.range.left)/n.range.width;s=Math.max(0,Math.min(1,s));let o=n9(this,d3,d4).call(this,n,s),l=n9(this,d5,d9).call(this,n,s);a.style.transform=`translateX(${o})`,a.style.setProperty("--_range-width",`${n.range.width}`),r.style.setProperty("--_box-shift",`${l}`),r.style.setProperty("--_box-width",`${n.box.width}px`),1>Math.abs(Math.round(n3(this,dK))-Math.round(s*i))&&s>.01&&s<.99||(n5(this,dK,s*i),n9(this,d7,ue).call(this,n3(this,dK)))},d7=new WeakSet,ue=function(e){this.dispatchEvent(new id.CustomEvent(tN.MEDIA_PREVIEW_REQUEST,{composed:!0,bubbles:!0,detail:e}))},ut=new WeakSet,ui=function(){n3(this,dH).stop();let e=n6(this);this.dispatchEvent(new id.CustomEvent(tN.MEDIA_SEEK_REQUEST,{composed:!0,bubbles:!0,detail:e}))},n7.shadowRootOptions={mode:"open"},n7.getContainerTemplateHTML=function(e){return`
    <style>
      :host {
        --media-box-border-radius: 4px;
        --media-box-padding-left: 10px;
        --media-box-padding-right: 10px;
        --media-preview-border-radius: var(--media-box-border-radius);
        --media-box-arrow-offset: var(--media-box-border-radius);
        --_control-background: var(--media-control-background, var(--media-secondary-color, rgb(20 20 30 / .7)));
        --_preview-background: var(--media-preview-background, var(--_control-background));

        
        contain: layout;
      }

      #buffered {
        background: var(--media-time-range-buffered-color, rgb(255 255 255 / .4));
        position: absolute;
        height: 100%;
        will-change: width;
      }

      #preview-rail,
      #current-rail {
        width: 100%;
        position: absolute;
        left: 0;
        bottom: 100%;
        pointer-events: none;
        will-change: transform;
      }

      [part~="box"] {
        width: min-content;
        
        position: absolute;
        bottom: 100%;
        flex-direction: column;
        align-items: center;
        transform: translateX(-50%);
      }

      [part~="current-box"] {
        display: var(--media-current-box-display, var(--media-box-display, flex));
        margin: var(--media-current-box-margin, var(--media-box-margin, 0 0 5px));
        visibility: hidden;
      }

      [part~="preview-box"] {
        display: var(--media-preview-box-display, var(--media-box-display, flex));
        margin: var(--media-preview-box-margin, var(--media-box-margin, 0 0 5px));
        transition-property: var(--media-preview-transition-property, visibility, opacity);
        transition-duration: var(--media-preview-transition-duration-out, .25s);
        transition-delay: var(--media-preview-transition-delay-out, 0s);
        visibility: hidden;
        opacity: 0;
      }

      :host(:is([${tW.MEDIA_PREVIEW_IMAGE}], [${tW.MEDIA_PREVIEW_TIME}])[dragging]) [part~="preview-box"] {
        transition-duration: var(--media-preview-transition-duration-in, .5s);
        transition-delay: var(--media-preview-transition-delay-in, .25s);
        visibility: visible;
        opacity: 1;
      }

      @media (hover: hover) {
        :host(:is([${tW.MEDIA_PREVIEW_IMAGE}], [${tW.MEDIA_PREVIEW_TIME}]):hover) [part~="preview-box"] {
          transition-duration: var(--media-preview-transition-duration-in, .5s);
          transition-delay: var(--media-preview-transition-delay-in, .25s);
          visibility: visible;
          opacity: 1;
        }
      }

      media-preview-thumbnail,
      ::slotted(media-preview-thumbnail) {
        visibility: hidden;
        
        transition: visibility 0s .25s;
        transition-delay: calc(var(--media-preview-transition-delay-out, 0s) + var(--media-preview-transition-duration-out, .25s));
        background: var(--media-preview-thumbnail-background, var(--_preview-background));
        box-shadow: var(--media-preview-thumbnail-box-shadow, 0 0 4px rgb(0 0 0 / .2));
        max-width: var(--media-preview-thumbnail-max-width, 180px);
        max-height: var(--media-preview-thumbnail-max-height, 160px);
        min-width: var(--media-preview-thumbnail-min-width, 120px);
        min-height: var(--media-preview-thumbnail-min-height, 80px);
        border: var(--media-preview-thumbnail-border);
        border-radius: var(--media-preview-thumbnail-border-radius,
          var(--media-preview-border-radius) var(--media-preview-border-radius) 0 0);
      }

      :host([${tW.MEDIA_PREVIEW_IMAGE}][dragging]) media-preview-thumbnail,
      :host([${tW.MEDIA_PREVIEW_IMAGE}][dragging]) ::slotted(media-preview-thumbnail) {
        transition-delay: var(--media-preview-transition-delay-in, .25s);
        visibility: visible;
      }

      @media (hover: hover) {
        :host([${tW.MEDIA_PREVIEW_IMAGE}]:hover) media-preview-thumbnail,
        :host([${tW.MEDIA_PREVIEW_IMAGE}]:hover) ::slotted(media-preview-thumbnail) {
          transition-delay: var(--media-preview-transition-delay-in, .25s);
          visibility: visible;
        }

        :host([${tW.MEDIA_PREVIEW_TIME}]:hover) {
          --media-time-range-hover-display: block;
        }
      }

      media-preview-chapter-display,
      ::slotted(media-preview-chapter-display) {
        font-size: var(--media-font-size, 13px);
        line-height: 17px;
        min-width: 0;
        visibility: hidden;
        
        transition: min-width 0s, border-radius 0s, margin 0s, padding 0s, visibility 0s;
        transition-delay: calc(var(--media-preview-transition-delay-out, 0s) + var(--media-preview-transition-duration-out, .25s));
        background: var(--media-preview-chapter-background, var(--_preview-background));
        border-radius: var(--media-preview-chapter-border-radius,
          var(--media-preview-border-radius) var(--media-preview-border-radius)
          var(--media-preview-border-radius) var(--media-preview-border-radius));
        padding: var(--media-preview-chapter-padding, 3.5px 9px);
        margin: var(--media-preview-chapter-margin, 0 0 5px);
        text-shadow: var(--media-preview-chapter-text-shadow, 0 0 4px rgb(0 0 0 / .75));
      }

      :host([${tW.MEDIA_PREVIEW_IMAGE}]) media-preview-chapter-display,
      :host([${tW.MEDIA_PREVIEW_IMAGE}]) ::slotted(media-preview-chapter-display) {
        transition-delay: var(--media-preview-transition-delay-in, .25s);
        border-radius: var(--media-preview-chapter-border-radius, 0);
        padding: var(--media-preview-chapter-padding, 3.5px 9px 0);
        margin: var(--media-preview-chapter-margin, 0);
        min-width: 100%;
      }

      media-preview-chapter-display[${tW.MEDIA_PREVIEW_CHAPTER}],
      ::slotted(media-preview-chapter-display[${tW.MEDIA_PREVIEW_CHAPTER}]) {
        visibility: visible;
      }

      media-preview-chapter-display:not([aria-valuetext]),
      ::slotted(media-preview-chapter-display:not([aria-valuetext])) {
        display: none;
      }

      media-preview-time-display,
      ::slotted(media-preview-time-display),
      media-time-display,
      ::slotted(media-time-display) {
        font-size: var(--media-font-size, 13px);
        line-height: 17px;
        min-width: 0;
        
        transition: min-width 0s, border-radius 0s;
        transition-delay: calc(var(--media-preview-transition-delay-out, 0s) + var(--media-preview-transition-duration-out, .25s));
        background: var(--media-preview-time-background, var(--_preview-background));
        border-radius: var(--media-preview-time-border-radius,
          var(--media-preview-border-radius) var(--media-preview-border-radius)
          var(--media-preview-border-radius) var(--media-preview-border-radius));
        padding: var(--media-preview-time-padding, 3.5px 9px);
        margin: var(--media-preview-time-margin, 0);
        text-shadow: var(--media-preview-time-text-shadow, 0 0 4px rgb(0 0 0 / .75));
        transform: translateX(min(
          max(calc(50% - var(--_box-width) / 2),
          calc(var(--_box-shift, 0))),
          calc(var(--_box-width) / 2 - 50%)
        ));
      }

      :host([${tW.MEDIA_PREVIEW_IMAGE}]) media-preview-time-display,
      :host([${tW.MEDIA_PREVIEW_IMAGE}]) ::slotted(media-preview-time-display) {
        transition-delay: var(--media-preview-transition-delay-in, .25s);
        border-radius: var(--media-preview-time-border-radius,
          0 0 var(--media-preview-border-radius) var(--media-preview-border-radius));
        min-width: 100%;
      }

      :host([${tW.MEDIA_PREVIEW_TIME}]:hover) {
        --media-time-range-hover-display: block;
      }

      [part~="arrow"],
      ::slotted([part~="arrow"]) {
        display: var(--media-box-arrow-display, inline-block);
        transform: translateX(min(
          max(calc(50% - var(--_box-width) / 2 + var(--media-box-arrow-offset)),
          calc(var(--_box-shift, 0))),
          calc(var(--_box-width) / 2 - 50% - var(--media-box-arrow-offset))
        ));
        
        border-color: transparent;
        border-top-color: var(--media-box-arrow-background, var(--_control-background));
        border-width: var(--media-box-arrow-border-width,
          var(--media-box-arrow-height, 5px) var(--media-box-arrow-width, 6px) 0);
        border-style: solid;
        justify-content: center;
        height: 0;
      }
    </style>
    <div id="preview-rail">
      <slot name="preview" part="box preview-box">
        <media-preview-thumbnail>
          <template shadowrootmode="${nP.shadowRootOptions.mode}">
            ${nP.getTemplateHTML({})}
          </template>
        </media-preview-thumbnail>
        <media-preview-chapter-display></media-preview-chapter-display>
        <media-preview-time-display></media-preview-time-display>
        <slot name="preview-arrow"><div part="arrow"></div></slot>
      </slot>
    </div>
    <div id="current-rail">
      <slot name="current" part="box current-box">
        
      </slot>
    </div>
  `},id.customElements.get("media-time-range")||id.customElements.define("media-time-range",n7),id.customElements.get("media-volume-range")||id.customElements.define("media-volume-range",class extends rU{static get observedAttributes(){return[...super.observedAttributes,tW.MEDIA_VOLUME,tW.MEDIA_MUTED,tW.MEDIA_VOLUME_UNAVAILABLE]}constructor(){super(),this.range.addEventListener("input",()=>{let e=this.range.value,t=new id.CustomEvent(tN.MEDIA_VOLUME_REQUEST,{composed:!0,bubbles:!0,detail:e});this.dispatchEvent(t)})}connectedCallback(){super.connectedCallback(),this.range.setAttribute("aria-label",ie("volume"))}attributeChangedCallback(e,t,i){if(super.attributeChangedCallback(e,t,i),e===tW.MEDIA_VOLUME||e===tW.MEDIA_MUTED){let e;this.range.valueAsNumber=this.mediaMuted?0:this.mediaVolume,this.range.setAttribute("aria-valuetext",(e=this.range.valueAsNumber,`${Math.round(100*e)}%`)),this.updateBar()}}get mediaVolume(){return iS(this,tW.MEDIA_VOLUME,1)}set mediaVolume(e){iM(this,tW.MEDIA_VOLUME,e)}get mediaMuted(){return iL(this,tW.MEDIA_MUTED)}set mediaMuted(e){iD(this,tW.MEDIA_MUTED,e)}get mediaVolumeUnavailable(){return ix(this,tW.MEDIA_VOLUME_UNAVAILABLE)}set mediaVolumeUnavailable(e){iN(this,tW.MEDIA_VOLUME_UNAVAILABLE,e)}});class se extends rc{constructor(){super(...arguments),this.container=null}static get observedAttributes(){return[...super.observedAttributes,tW.MEDIA_LOOP]}connectedCallback(){var e;super.connectedCallback(),this.container=(null==(e=this.shadowRoot)?void 0:e.querySelector("#icon"))||null,this.container&&(this.container.textContent=ie("Loop"))}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),e===tW.MEDIA_LOOP&&this.container&&this.setAttribute("aria-checked",this.mediaLoop?"true":"false")}get mediaLoop(){return iL(this,tW.MEDIA_LOOP)}set mediaLoop(e){iD(this,tW.MEDIA_LOOP,e)}handleClick(){let e=!this.mediaLoop,t=new id.CustomEvent(tN.MEDIA_LOOP_REQUEST,{composed:!0,bubbles:!0,detail:e});this.dispatchEvent(t)}}se.getSlotTemplateHTML=function(e){return`
      <style>
        :host {
          min-width: 4ch;
          padding: var(--media-button-padding, var(--media-control-padding, 10px 5px));
          width: 100%;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 1rem;
          font-weight: var(--media-button-font-weight, normal);
        }

        #checked-indicator {
          display: none;
        }

        :host([${tW.MEDIA_LOOP}]) #checked-indicator {
          display: block;
        }
      </style>
      
      <span id="icon">
     </span>

      <div id="checked-indicator">
        <svg aria-hidden="true" viewBox="0 1 24 24" part="checked-indicator indicator">
          <path d="m10 15.17 9.193-9.191 1.414 1.414-10.606 10.606-6.364-6.364 1.414-1.414 4.95 4.95Z"/>
        </svg>
      </div>
    `},se.getTooltipContentHTML=function(){return ie("Loop")},id.customElements.get("media-loop-button")||id.customElements.define("media-loop-button",se);var st=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},si=(e,t,i)=>(st(e,t,"read from private field"),i?i.call(e):t.get(e)),sa=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},sr=(e,t,i,a)=>(st(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i);let sn={processCallback(e,t,i){if(i){for(let[e,a]of t)if(e in i){let t=i[e];"boolean"==typeof t&&a instanceof sc&&"boolean"==typeof a.element[a.attributeName]?a.booleanValue=t:"function"==typeof t&&a instanceof sc?a.element[a.attributeName]=t:a.value=t}}}};class ss extends id.DocumentFragment{constructor(e,t,i=sn){var a;super(),sa(this,ua,void 0),sa(this,ur,void 0),this.append(e.content.cloneNode(!0)),sr(this,ua,so(this)),sr(this,ur,i),null==(a=i.createCallback)||a.call(i,this,si(this,ua),t),i.processCallback(this,si(this,ua),t)}update(e){si(this,ur).processCallback(this,si(this,ua),e)}}ua=new WeakMap,ur=new WeakMap;let so=(e,t=[])=>{let i,a;for(let r of e.attributes||[])if(r.value.includes("{{")){let n=new sh;for([i,a]of sd(r.value))if(i){let i=new sc(e,r.name,r.namespaceURI);n.append(i),t.push([a,i])}else n.append(a);r.value=n.toString()}for(let r of e.childNodes)if(1!==r.nodeType||r instanceof HTMLTemplateElement){let n=r.data;if(1===r.nodeType||n.includes("{{")){let s=[];if(n)for([i,a]of sd(n))if(i){let i=new sp(e);s.push(i),t.push([a,i])}else s.push(new Text(a));else if(r instanceof HTMLTemplateElement){let i=new sv(e,r);s.push(i),t.push([i.expression,i])}r.replaceWith(...s.flatMap(e=>e.replacementNodes||[e]))}}else so(r,t);return t},sl={},sd=e=>{let t="",i=0,a=sl[e],r=0,n;if(a)return a;for(a=[];n=e[r];r++)"{"===n&&"{"===e[r+1]&&"\\"!==e[r-1]&&e[r+2]&&1==++i?(t&&a.push([0,t]),t="",r++):"}"!==n||"}"!==e[r+1]||"\\"===e[r-1]||--i?t+=n||"":(a.push([1,t.trim()]),t="",r++);return t&&a.push([0,(i>0?"{{":"")+t]),sl[e]=a};class su{get value(){return""}set value(e){}toString(){return this.value}}let sm=new WeakMap;class sh{constructor(){sa(this,un,[])}[Symbol.iterator](){return si(this,un).values()}get length(){return si(this,un).length}item(e){return si(this,un)[e]}append(...e){for(let t of e)t instanceof sc&&sm.set(t,this),si(this,un).push(t)}toString(){return si(this,un).join("")}}un=new WeakMap;class sc extends su{constructor(e,t,i){super(),sa(this,uu),sa(this,us,""),sa(this,uo,void 0),sa(this,ul,void 0),sa(this,ud,void 0),sr(this,uo,e),sr(this,ul,t),sr(this,ud,i)}get attributeName(){return si(this,ul)}get attributeNamespace(){return si(this,ud)}get element(){return si(this,uo)}get value(){return si(this,us)}set value(e){si(this,us)!==e&&(sr(this,us,e),si(this,uu,um)&&1!==si(this,uu,um).length?si(this,uo).setAttributeNS(si(this,ud),si(this,ul),si(this,uu,um).toString()):null==e?si(this,uo).removeAttributeNS(si(this,ud),si(this,ul)):si(this,uo).setAttributeNS(si(this,ud),si(this,ul),e))}get booleanValue(){return si(this,uo).hasAttributeNS(si(this,ud),si(this,ul))}set booleanValue(e){if(si(this,uu,um)&&1!==si(this,uu,um).length)throw new DOMException("Value is not fully templatized");this.value=e?"":null}}us=new WeakMap,uo=new WeakMap,ul=new WeakMap,ud=new WeakMap,uu=new WeakSet,um=function(){return sm.get(this)};class sp extends su{constructor(e,t){super(),sa(this,uh,void 0),sa(this,uc,void 0),sr(this,uh,e),sr(this,uc,t?[...t]:[new Text])}get replacementNodes(){return si(this,uc)}get parentNode(){return si(this,uh)}get nextSibling(){return si(this,uc)[si(this,uc).length-1].nextSibling}get previousSibling(){return si(this,uc)[0].previousSibling}get value(){return si(this,uc).map(e=>e.textContent).join("")}set value(e){this.replace(e)}replace(...e){let t=e.flat().flatMap(e=>null==e?[new Text]:e.forEach?[...e]:11===e.nodeType?[...e.childNodes]:e.nodeType?[e]:[new Text(e)]);t.length||t.push(new Text),sr(this,uc,function(e,t,i,a=null){let r=0,n,s,o,l=i.length,d=t.length;for(;r<l&&r<d&&t[r]==i[r];)r++;for(;r<l&&r<d&&i[l-1]==t[d-1];)a=i[--d,--l];if(r==d)for(;r<l;)e.insertBefore(i[r++],a);if(r==l)for(;r<d;)e.removeChild(t[r++]);else{for(n=t[r];r<l;)o=i[r++],s=n?n.nextSibling:a,n==o?n=s:r<l&&i[r]==s?(e.replaceChild(o,n),n=s):e.insertBefore(o,n);for(;n!=a;)s=n.nextSibling,e.removeChild(n),n=s}return i}(si(this,uc)[0].parentNode,si(this,uc),t,this.nextSibling))}}uh=new WeakMap,uc=new WeakMap;class sv extends sp{constructor(e,t){const i=t.getAttribute("directive")||t.getAttribute("type");let a=t.getAttribute("expression")||t.getAttribute(i)||"";a.startsWith("{{")&&(a=a.trim().slice(2,-2).trim()),super(e),this.expression=a,this.template=t,this.directive=i}}let sb={string:e=>String(e)};class sE{constructor(e){this.template=e,this.state=void 0}}let sg=new WeakMap,sf=new WeakMap,sA={partial:(e,t)=>{t[e.expression]=new sE(e.template)},if:(e,t)=>{var i;if(s_(e.expression,t))if(sg.get(e)!==e.template){sg.set(e,e.template);let i=new ss(e.template,t,sT);e.replace(i),sf.set(e,i)}else null==(i=sf.get(e))||i.update(t);else e.replace(""),sg.delete(e),sf.delete(e)}},sy=Object.keys(sA),sT={processCallback(e,t,i){var a,r;if(i)for(let[e,n]of t){if(n instanceof sv){if(!n.directive){let e=sy.find(e=>n.template.hasAttribute(e));e&&(n.directive=e,n.expression=n.template.getAttribute(e))}null==(a=sA[n.directive])||a.call(sA,n,i);continue}let t=s_(e,i);if(t instanceof sE){sg.get(n)!==t.template?(sg.set(n,t.template),n.value=t=new ss(t.template,t.state,sT),sf.set(n,t)):null==(r=sf.get(n))||r.update(t.state);continue}t?(n instanceof sc&&n.attributeName.startsWith("aria-")&&(t=String(t)),n instanceof sc?"boolean"==typeof t?n.booleanValue=t:"function"==typeof t?n.element[n.attributeName]=t:n.value=t:(n.value=t,sg.delete(n),sf.delete(n))):n instanceof sc?n.value=void 0:(n.value=void 0,sg.delete(n),sf.delete(n))}}},sk={"!":e=>!e,"!!":e=>!!e,"==":(e,t)=>e==t,"!=":(e,t)=>e!=t,">":(e,t)=>e>t,">=":(e,t)=>e>=t,"<":(e,t)=>e<t,"<=":(e,t)=>e<=t,"??":(e,t)=>null!=e?e:t,"|":(e,t)=>{var i;return null==(i=sb[t])?void 0:i.call(sb,e)}};function s_(e,t={}){var i,a,r,n,s,o,l;let d=(function(e,t){let i,a,r,n=[];for(;e;){for(let n in r=null,i=e.length,t)(a=t[n].exec(e))&&a.index<i&&(r={token:a[0],type:n,matches:a.slice(1)},i=a.index);i&&n.push({token:e.substr(0,i),type:void 0}),r&&n.push(r),e=e.substr(i+(r?r.token.length:0))}return n})(e,{boolean:/true|false/,number:/-?\d+\.?\d*/,string:/(["'])((?:\\.|[^\\])*?)\1/,operator:/[!=><][=!]?|\?\?|\|/,ws:/\s+/,param:/[$a-z_][$\w]*/i}).filter(({type:e})=>"ws"!==e);if(0===d.length||d.some(({type:e})=>!e))return sw(e);if((null==(i=d[0])?void 0:i.token)===">"){let i=t[null==(a=d[1])?void 0:a.token];if(!i)return sw(e);let o={...t};i.state=o;let l=d.slice(2);for(let e=0;e<l.length;e+=3){let i=null==(r=l[e])?void 0:r.token,a=null==(n=l[e+1])?void 0:n.token,d=null==(s=l[e+2])?void 0:s.token;i&&"="===a&&(o[i]=sR(d,t))}return i}if(1===d.length)return sI(d[0])?sR(d[0].token,t):sw(e);if(2===d.length){let i=sk[null==(o=d[0])?void 0:o.token];return i&&sI(d[1])?i(sR(d[1].token,t)):sw(e)}if(3===d.length){let i=null==(l=d[1])?void 0:l.token,a=sk[i];if(!a||!sI(d[0])||!sI(d[2]))return sw(e);let r=sR(d[0].token,t);return a(r,"|"===i?d[2].token:sR(d[2].token,t))}}function sw(e){return console.warn(`Warning: invalid expression \`${e}\``),!1}function sI({type:e}){return["number","boolean","string","param"].includes(e)}function sR(e,t){let i=e[0],a=e.slice(-1);return"true"===e||"false"===e?"true"===e:i===a&&["'",'"'].includes(i)?e.slice(1,-1):t1(e)?parseFloat(e):t[e]}var sC=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},sS=(e,t,i)=>(sC(e,t,"read from private field"),i?i.call(e):t.get(e)),sM=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},sL=(e,t,i,a)=>(sC(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i),sD=(e,t,i)=>(sC(e,t,"access private method"),i);let sx={mediatargetlivewindow:"targetlivewindow",mediastreamtype:"streamtype"},sN=iu.createElement("template");sN.innerHTML=`
  <style>
    :host {
      display: inline-block;
      line-height: 0;
    }

    media-controller {
      width: 100%;
      height: 100%;
    }

    media-captions-button:not([mediasubtitleslist]),
    media-captions-menu:not([mediasubtitleslist]),
    media-captions-menu-button:not([mediasubtitleslist]),
    media-audio-track-menu[mediaaudiotrackunavailable],
    media-audio-track-menu-button[mediaaudiotrackunavailable],
    media-rendition-menu[mediarenditionunavailable],
    media-rendition-menu-button[mediarenditionunavailable],
    media-volume-range[mediavolumeunavailable],
    media-airplay-button[mediaairplayunavailable],
    media-fullscreen-button[mediafullscreenunavailable],
    media-cast-button[mediacastunavailable],
    media-pip-button[mediapipunavailable] {
      display: none;
    }
  </style>
`;class sO extends id.HTMLElement{constructor(){super(),sM(this,uE),sM(this,uf),sM(this,up,void 0),sM(this,uv,void 0),sM(this,ub,void 0),this.shadowRoot?this.renderRoot=this.shadowRoot:(this.renderRoot=this.attachShadow({mode:"open"}),this.createRenderer());const e=new MutationObserver(e=>{var t;(!this.mediaController||(null==(t=this.mediaController)?void 0:t.breakpointsComputed))&&e.some(e=>{let t=e.target;return t===this||"media-controller"===t.localName&&!!(sx[e.attributeName]||e.attributeName.startsWith("breakpoint"))})&&this.render()});e.observe(this,{attributes:!0}),e.observe(this.renderRoot,{attributes:!0,subtree:!0}),this.addEventListener(t$.BREAKPOINTS_COMPUTED,this.render),sD(this,uE,ug).call(this,"template")}get mediaController(){return this.renderRoot.querySelector("media-controller")}get template(){var e;return null!=(e=sS(this,up))?e:this.constructor.template}set template(e){null===e?this.removeAttribute("template"):"string"==typeof e?this.setAttribute("template",e):e instanceof HTMLTemplateElement&&(sL(this,up,e),sL(this,ub,null),this.createRenderer())}get props(){var e,t,i;let a=[...Array.from(null!=(t=null==(e=this.mediaController)?void 0:e.attributes)?t:[]).filter(({name:e})=>sx[e]||e.startsWith("breakpoint")),...Array.from(this.attributes)],r={};for(let e of a){let t=null!=(i=sx[e.name])?i:e.name.replace(/[-_]([a-z])/g,(e,t)=>t.toUpperCase()),{value:a}=e;null!=a?(t1(a)&&(a=parseFloat(a)),r[t]=""===a||a):r[t]=!1}return r}attributeChangedCallback(e,t,i){"template"===e&&t!=i&&sD(this,uf,uA).call(this)}connectedCallback(){sD(this,uf,uA).call(this)}createRenderer(){this.template instanceof HTMLTemplateElement&&this.template!==sS(this,uv)&&(sL(this,uv,this.template),this.renderer=new ss(this.template,this.props,this.constructor.processor),this.renderRoot.textContent="",this.renderRoot.append(sN.content.cloneNode(!0),this.renderer))}render(){var e;null==(e=this.renderer)||e.update(this.props)}}async function sP(e){let t=await fetch(e);if(200!==t.status)throw Error(`Failed to load resource: the server responded with a status of ${t.status}`);return t.text()}function sU(e){return e.split("-")[0]}up=new WeakMap,uv=new WeakMap,ub=new WeakMap,uE=new WeakSet,ug=function(e){if(Object.prototype.hasOwnProperty.call(this,e)){let t=this[e];delete this[e],this[e]=t}},uf=new WeakSet,uA=function(){var e;let t=this.getAttribute("template");if(!t||t===sS(this,ub))return;let i=this.getRootNode(),a=null==(e=null==i?void 0:i.getElementById)?void 0:e.call(i,t);if(a){sL(this,ub,t),sL(this,up,a),this.createRenderer();return}(function(e){if(!/^(\/|\.\/|https?:\/\/)/.test(e))return!1;let t=/^https?:\/\//.test(e)?void 0:location.origin;try{new URL(e,t)}catch(e){return!1}return!0})(t)&&(sL(this,ub,t),sP(t).then(e=>{let t=iu.createElement("template");t.innerHTML=e,sL(this,up,t),this.createRenderer()}).catch(console.error))},sO.observedAttributes=["template"],sO.processor=sT,id.customElements.get("media-theme")||id.customElements.define("media-theme",sO);class sW extends Event{constructor({action:e="auto",relatedTarget:t,...i}){super("invoke",i),this.action=e,this.relatedTarget=t}}class s$ extends Event{constructor({newState:e,oldState:t,...i}){super("toggle",i),this.newState=e,this.oldState=t}}var sB=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},sH=(e,t,i)=>(sB(e,t,"read from private field"),i?i.call(e):t.get(e)),sV=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},sK=(e,t,i,a)=>(sB(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i),sF=(e,t,i)=>(sB(e,t,"access private method"),i);function sY({type:e,text:t,value:i,checked:a}){let r=iu.createElement("media-chrome-menu-item");r.type=null!=e?e:"",r.part.add("menu-item"),e&&r.part.add(e),r.value=i,r.checked=a;let n=iu.createElement("span");return n.textContent=t,r.append(n),r}function sG(e,t){let i=e.querySelector(`:scope > [slot="${t}"]`);if((null==i?void 0:i.nodeName)=="SLOT"&&(i=i.assignedElements({flatten:!0})[0]),i)return i.cloneNode(!0);let a=e.shadowRoot.querySelector(`[name="${t}"] > svg`);return a?a.cloneNode(!0):""}let sq="style",sj="hidden",sZ="disabled";class sQ extends id.HTMLElement{constructor(){if(super(),sV(this,uC),sV(this,uM),sV(this,ux),sV(this,uO),sV(this,uU),sV(this,u$),sV(this,uK),sV(this,uY),sV(this,uq),sV(this,uZ),sV(this,uz),sV(this,uJ),sV(this,u1),sV(this,u3),sV(this,u5),sV(this,u8),sV(this,u7),sV(this,mt),sV(this,uy,null),sV(this,uT,null),sV(this,uk,null),sV(this,u_,new Set),sV(this,uw,void 0),sV(this,uI,!1),sV(this,uR,null),sV(this,uD,()=>{let e=sH(this,u_),t=new Set(this.items);for(let i of e)t.has(i)||this.dispatchEvent(new CustomEvent("removemenuitem",{detail:i}));for(let i of t)e.has(i)||this.dispatchEvent(new CustomEvent("addmenuitem",{detail:i}));sK(this,u_,t)}),sV(this,uH,()=>{sF(this,uK,uF).call(this),sF(this,uY,uG).call(this,!1)}),sV(this,uV,()=>{sF(this,uK,uF).call(this)}),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);const e=ib(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e)}this.container=this.shadowRoot.querySelector("#container"),this.defaultSlot=this.shadowRoot.querySelector("slot:not([name])"),this.shadowRoot.addEventListener("slotchange",this),sK(this,uw,new MutationObserver(sH(this,uD))),sH(this,uw).observe(this.defaultSlot,{childList:!0})}static get observedAttributes(){return[sZ,sj,sq,"anchor",tO.MEDIA_CONTROLLER]}static formatMenuItemText(e,t){return e}enable(){this.addEventListener("click",this),this.addEventListener("focusout",this),this.addEventListener("keydown",this),this.addEventListener("invoke",this),this.addEventListener("toggle",this)}disable(){this.removeEventListener("click",this),this.removeEventListener("focusout",this),this.removeEventListener("keyup",this),this.removeEventListener("invoke",this),this.removeEventListener("toggle",this)}handleEvent(e){switch(e.type){case"slotchange":sF(this,uC,uS).call(this,e);break;case"invoke":sF(this,uO,uP).call(this,e);break;case"click":sF(this,uq,uj).call(this,e);break;case"toggle":sF(this,uz,uX).call(this,e);break;case"focusout":sF(this,u1,u2).call(this,e);break;case"keydown":sF(this,u3,u4).call(this,e)}}connectedCallback(){var e,t;sK(this,uR,iC(this.shadowRoot,":host")),sF(this,ux,uN).call(this),this.hasAttribute("disabled")||this.enable(),this.role||(this.role="menu"),sK(this,uy,ig(this)),null==(t=null==(e=sH(this,uy))?void 0:e.associateElement)||t.call(e,this),this.hidden||(ip(sX(this),sH(this,uH)),ip(this,sH(this,uV))),sF(this,uM,uL).call(this)}disconnectedCallback(){var e,t;iv(sX(this),sH(this,uH)),iv(this,sH(this,uV)),this.disable(),null==(t=null==(e=sH(this,uy))?void 0:e.unassociateElement)||t.call(e,this),sK(this,uy,null)}attributeChangedCallback(e,t,i){var a,r,n,s;e===sj&&i!==t?(sH(this,uI)||sK(this,uI,!0),this.hidden?sF(this,u$,uB).call(this):sF(this,uU,uW).call(this),this.dispatchEvent(new s$({oldState:this.hidden?"open":"closed",newState:this.hidden?"closed":"open",bubbles:!0}))):e===tO.MEDIA_CONTROLLER?(t&&(null==(r=null==(a=sH(this,uy))?void 0:a.unassociateElement)||r.call(a,this),sK(this,uy,null)),i&&this.isConnected&&(sK(this,uy,ig(this)),null==(s=null==(n=sH(this,uy))?void 0:n.associateElement)||s.call(n,this))):e===sZ&&i!==t?null==i?this.enable():this.disable():e===sq&&i!==t&&sF(this,ux,uN).call(this)}formatMenuItemText(e,t){return this.constructor.formatMenuItemText(e,t)}get anchor(){return this.getAttribute("anchor")}set anchor(e){this.setAttribute("anchor",`${e}`)}get anchorElement(){var e;return this.anchor?null==(e=iw(this))?void 0:e.querySelector(`#${this.anchor}`):null}get items(){return this.defaultSlot.assignedElements({flatten:!0}).filter(sz)}get radioGroupItems(){return this.items.filter(e=>"menuitemradio"===e.role)}get checkedItems(){return this.items.filter(e=>e.checked)}get value(){var e,t;return null!=(t=null==(e=this.checkedItems[0])?void 0:e.value)?t:""}set value(e){let t=this.items.find(t=>t.value===e);t&&sF(this,mt,mi).call(this,t)}focus(){if(sK(this,uT,i_()),this.items.length){sF(this,u7,me).call(this,this.items[0]),this.items[0].focus();return}let e=this.querySelector('[autofocus], [tabindex]:not([tabindex="-1"]), [role="menu"]');null==e||e.focus()}handleSelect(e){var t;let i=sF(this,u5,u9).call(this,e);i&&(sF(this,mt,mi).call(this,i,"checkbox"===i.type),sH(this,uk)&&!this.hidden&&(null==(t=sH(this,uT))||t.focus(),this.hidden=!0))}get keysUsed(){return["Enter","Escape","Tab"," ","ArrowDown","ArrowUp","Home","End"]}handleMove(e){var t,i;let{key:a}=e,r=this.items,n=null!=(i=null!=(t=sF(this,u5,u9).call(this,e))?t:sF(this,u8,u6).call(this))?i:r[0],s=Math.max(0,r.indexOf(n));"ArrowDown"===a?s++:"ArrowUp"===a?s--:"Home"===e.key?s=0:"End"===e.key&&(s=r.length-1),s<0&&(s=r.length-1),s>r.length-1&&(s=0),sF(this,u7,me).call(this,r[s]),r[s].focus()}}function sz(e){return["menuitem","menuitemradio","menuitemcheckbox"].includes(null==e?void 0:e.role)}function sX(e){var t;return null!=(t=e.getAttribute("bounds")?ik(e,`#${e.getAttribute("bounds")}`):iE(e)||e.parentElement)?t:e}uy=new WeakMap,uT=new WeakMap,uk=new WeakMap,u_=new WeakMap,uw=new WeakMap,uI=new WeakMap,uR=new WeakMap,uC=new WeakSet,uS=function(e){let t=e.target;for(let e of t.assignedNodes({flatten:!0}))3===e.nodeType&&""===e.textContent.trim()&&e.remove();["header","title"].includes(t.name)&&sF(this,uM,uL).call(this),t.name||sH(this,uD).call(this)},uM=new WeakSet,uL=function(){let e=this.shadowRoot.querySelector('slot[name="header"]');e.hidden=0===this.shadowRoot.querySelector('slot[name="title"]').assignedNodes().length&&0===e.assignedNodes().length},uD=new WeakMap,ux=new WeakSet,uN=function(){var e;let t=this.shadowRoot.querySelector("#layout-row"),i=null==(e=getComputedStyle(this).getPropertyValue("--media-menu-layout"))?void 0:e.trim();t.setAttribute("media","row"===i?"":"width:0")},uO=new WeakSet,uP=function(e){sK(this,uk,e.relatedTarget),iT(this,e.relatedTarget)||(this.hidden=!this.hidden)},uU=new WeakSet,uW=function(){var e;null==(e=sH(this,uk))||e.setAttribute("aria-expanded","true"),this.addEventListener("transitionend",()=>this.focus(),{once:!0}),ip(sX(this),sH(this,uH)),ip(this,sH(this,uV))},u$=new WeakSet,uB=function(){var e;null==(e=sH(this,uk))||e.setAttribute("aria-expanded","false"),iv(sX(this),sH(this,uH)),iv(this,sH(this,uV))},uH=new WeakMap,uV=new WeakMap,uK=new WeakSet,uF=function(e){if(this.hasAttribute("mediacontroller")&&!this.anchor||this.hidden||!this.anchorElement)return;let{x:t,y:i}=function({anchor:e,floating:t,placement:i}){let{x:a,y:r}=function({anchor:e,floating:t},i){let a,r="x"==(["top","bottom"].includes(sU(i))?"y":"x")?"y":"x",n="y"===r?"height":"width",s=sU(i),o=e.x+e.width/2-t.width/2,l=e.y+e.height/2-t.height/2,d=e[n]/2-t[n]/2;switch(s){case"top":a={x:o,y:e.y-t.height};break;case"bottom":a={x:o,y:e.y+e.height};break;case"right":a={x:e.x+e.width,y:l};break;case"left":a={x:e.x-t.width,y:l};break;default:a={x:e.x,y:e.y}}switch(i.split("-")[1]){case"start":a[r]-=d;break;case"end":a[r]+=d}return a}(function({anchor:e,floating:t}){var i,a,r;let n,s;return{anchor:(i=e,a=t.offsetParent,n=i.getBoundingClientRect(),s=null!=(r=null==a?void 0:a.getBoundingClientRect())?r:{x:0,y:0},{x:n.x-s.x,y:n.y-s.y,width:n.width,height:n.height}),floating:{x:0,y:0,width:t.offsetWidth,height:t.offsetHeight}}}({anchor:e,floating:t}),i);return{x:a,y:r}}({anchor:this.anchorElement,floating:this,placement:"top-start"});null!=e||(e=this.offsetWidth);let a=sX(this).getBoundingClientRect(),r=a.width-t-e,n=a.height-i-this.offsetHeight,{style:s}=sH(this,uR);s.setProperty("position","absolute"),s.setProperty("right",`${Math.max(0,r)}px`),s.setProperty("--_menu-bottom",`${n}px`);let o=getComputedStyle(this),l=s.getPropertyValue("--_menu-bottom")===o.bottom?n:parseFloat(o.bottom),d=a.height-l-parseFloat(o.marginBottom);this.style.setProperty("--_menu-max-height",`${d}px`)},uY=new WeakSet,uG=function(e){let t=this.querySelector('[role="menuitem"][aria-haspopup][aria-expanded="true"]'),i=null==t?void 0:t.querySelector('[role="menu"]'),{style:a}=sH(this,uR);if(e||a.setProperty("--media-menu-transition-in","none"),i){let e=i.offsetHeight,a=Math.max(i.offsetWidth,t.offsetWidth);this.style.setProperty("min-width",`${a}px`),this.style.setProperty("min-height",`${e}px`),sF(this,uK,uF).call(this,a)}else this.style.removeProperty("min-width"),this.style.removeProperty("min-height"),sF(this,uK,uF).call(this);a.removeProperty("--media-menu-transition-in")},uq=new WeakSet,uj=function(e){var t;if(e.stopPropagation(),e.composedPath().includes(sH(this,uZ,uQ))){null==(t=sH(this,uT))||t.focus(),this.hidden=!0;return}let i=sF(this,u5,u9).call(this,e);!i||i.hasAttribute("disabled")||(sF(this,u7,me).call(this,i),this.handleSelect(e))},uZ=new WeakSet,uQ=function(){var e;return null==(e=this.shadowRoot.querySelector('slot[name="header"]').assignedElements({flatten:!0}))?void 0:e.find(e=>e.matches('button[part~="back"]'))},uz=new WeakSet,uX=function(e){if(e.target===this)return;sF(this,uJ,u0).call(this);let t=Array.from(this.querySelectorAll('[role="menuitem"][aria-haspopup]'));for(let i of t)i.invokeTargetElement!=e.target&&("open"!=e.newState||"true"!=i.getAttribute("aria-expanded")||i.invokeTargetElement.hidden||i.invokeTargetElement.dispatchEvent(new sW({relatedTarget:i})));for(let e of t)e.setAttribute("aria-expanded",`${!e.submenuElement.hidden}`);sF(this,uY,uG).call(this,!0)},uJ=new WeakSet,u0=function(){let e=this.querySelector('[role="menuitem"] > [role="menu"]:not([hidden])');this.container.classList.toggle("has-expanded",!!e)},u1=new WeakSet,u2=function(e){var t;iT(this,e.relatedTarget)||(sH(this,uI)&&(null==(t=sH(this,uT))||t.focus()),sH(this,uk)&&sH(this,uk)!==e.relatedTarget&&!this.hidden&&(this.hidden=!0))},u3=new WeakSet,u4=function(e){var t,i,a,r,n;let{key:s,ctrlKey:o,altKey:l,metaKey:d}=e;if(!o&&!l&&!d&&this.keysUsed.includes(s))if(e.preventDefault(),e.stopPropagation(),"Tab"===s){if(sH(this,uI)){this.hidden=!0;return}e.shiftKey?null==(i=null==(t=this.previousElementSibling)?void 0:t.focus)||i.call(t):null==(r=null==(a=this.nextElementSibling)?void 0:a.focus)||r.call(a),this.blur()}else"Escape"===s?(null==(n=sH(this,uT))||n.focus(),sH(this,uI)&&(this.hidden=!0)):"Enter"===s||" "===s?this.handleSelect(e):this.handleMove(e)},u5=new WeakSet,u9=function(e){return e.composedPath().find(e=>["menuitemradio","menuitemcheckbox"].includes(e.role))},u8=new WeakSet,u6=function(){return this.items.find(e=>0===e.tabIndex)},u7=new WeakSet,me=function(e){for(let t of this.items)t.tabIndex=t===e?0:-1},mt=new WeakSet,mi=function(e,t){let i=[...this.checkedItems];"radio"===e.type&&this.radioGroupItems.forEach(e=>e.checked=!1),t?e.checked=!e.checked:e.checked=!0,this.checkedItems.some((e,t)=>e!=i[t])&&this.dispatchEvent(new Event("change",{bubbles:!0,composed:!0}))},sQ.shadowRootOptions={mode:"open"},sQ.getTemplateHTML=function(e){return`
    <style>
      :host {
        font: var(--media-font,
          var(--media-font-weight, normal)
          var(--media-font-size, 14px) /
          var(--media-text-content-height, var(--media-control-height, 24px))
          var(--media-font-family, helvetica neue, segoe ui, roboto, arial, sans-serif));
        color: var(--media-text-color, var(--media-primary-color, rgb(238 238 238)));
        --_menu-bg: rgb(20 20 30 / .8);
        background: var(--media-menu-background, var(--media-control-background, var(--media-secondary-color, var(--_menu-bg))));
        border-radius: var(--media-menu-border-radius);
        border: var(--media-menu-border, none);
        display: var(--media-menu-display, inline-flex) !important;
        
        transition: var(--media-menu-transition-in,
          visibility 0s,
          opacity .2s ease-out,
          transform .15s ease-out,
          left .2s ease-in-out,
          min-width .2s ease-in-out,
          min-height .2s ease-in-out
        ) !important;
        
        visibility: var(--media-menu-visibility, visible);
        opacity: var(--media-menu-opacity, 1);
        max-height: var(--media-menu-max-height, var(--_menu-max-height, 300px));
        transform: var(--media-menu-transform-in, translateY(0) scale(1));
        flex-direction: column;
        
        min-height: 0;
        position: relative;
        bottom: var(--_menu-bottom);
        box-sizing: border-box;
      } 

      @-moz-document url-prefix() {
        :host{
          --_menu-bg: rgb(20 20 30);
        }
      }

      :host([hidden]) {
        transition: var(--media-menu-transition-out,
          visibility .15s ease-in,
          opacity .15s ease-in,
          transform .15s ease-in
        ) !important;
        visibility: var(--media-menu-hidden-visibility, hidden);
        opacity: var(--media-menu-hidden-opacity, 0);
        max-height: var(--media-menu-hidden-max-height,
          var(--media-menu-max-height, var(--_menu-max-height, 300px)));
        transform: var(--media-menu-transform-out, translateY(2px) scale(.99));
        pointer-events: none;
      }

      :host([slot="submenu"]) {
        background: none;
        width: 100%;
        min-height: 100%;
        position: absolute;
        bottom: 0;
        right: -100%;
      }

      #container {
        display: flex;
        flex-direction: column;
        min-height: 0;
        transition: transform .2s ease-out;
        transform: translate(0, 0);
      }

      #container.has-expanded {
        transition: transform .2s ease-in;
        transform: translate(-100%, 0);
      }

      button {
        background: none;
        color: inherit;
        border: none;
        padding: 0;
        font: inherit;
        outline: inherit;
        display: inline-flex;
        align-items: center;
      }

      slot[name="header"][hidden] {
        display: none;
      }

      slot[name="header"] > *,
      slot[name="header"]::slotted(*) {
        padding: .4em .7em;
        border-bottom: 1px solid rgb(255 255 255 / .25);
        cursor: var(--media-cursor, default);
      }

      slot[name="header"] > button[part~="back"],
      slot[name="header"]::slotted(button[part~="back"]) {
        cursor: var(--media-cursor, pointer);
      }

      svg[part~="back"] {
        height: var(--media-menu-icon-height, var(--media-control-height, 24px));
        fill: var(--media-icon-color, var(--media-primary-color, rgb(238 238 238)));
        display: block;
        margin-right: .5ch;
      }

      slot:not([name]) {
        gap: var(--media-menu-gap);
        flex-direction: var(--media-menu-flex-direction, column);
        overflow: var(--media-menu-overflow, hidden auto);
        display: flex;
        min-height: 0;
      }

      :host([role="menu"]) slot:not([name]) {
        padding-block: .4em;
      }

      slot:not([name])::slotted([role="menu"]) {
        background: none;
      }

      media-chrome-menu-item > span {
        margin-right: .5ch;
        max-width: var(--media-menu-item-max-width);
        text-overflow: ellipsis;
        overflow: hidden;
      }
    </style>
    <style id="layout-row" media="width:0">

      slot[name="header"] > *,
      slot[name="header"]::slotted(*) {
        padding: .4em .5em;
      }

      slot:not([name]) {
        gap: var(--media-menu-gap, .25em);
        flex-direction: var(--media-menu-flex-direction, row);
        padding-inline: .5em;
      }

      media-chrome-menu-item {
        padding: .3em .5em;
      }

      media-chrome-menu-item[aria-checked="true"] {
        background: var(--media-menu-item-checked-background, rgb(255 255 255 / .2));
      }

      
      media-chrome-menu-item::part(checked-indicator) {
        display: var(--media-menu-item-checked-indicator-display, none);
      }
    </style>
    <div id="container" part="container">
      <slot name="header" hidden>
        <button part="back button" aria-label="Back to previous menu">
          <slot name="back-icon">
            <svg aria-hidden="true" viewBox="0 0 20 24" part="back indicator">
              <path d="m11.88 17.585.742-.669-4.2-4.665 4.2-4.666-.743-.669-4.803 5.335 4.803 5.334Z"/>
            </svg>
          </slot>
          <slot name="title"></slot>
        </button>
      </slot>
      <slot></slot>
    </div>
    <slot name="checked-indicator" hidden></slot>
  `},id.customElements.get("media-chrome-menu")||id.customElements.define("media-chrome-menu",sQ);var sJ=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},s0=(e,t,i)=>(sJ(e,t,"read from private field"),i?i.call(e):t.get(e)),s1=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},s2=(e,t,i,a)=>(sJ(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i),s3=(e,t,i)=>(sJ(e,t,"access private method"),i);let s4="type",s5="value",s9="checked",s8="disabled";class s6 extends id.HTMLElement{constructor(){if(super(),s1(this,mn),s1(this,mo),s1(this,md),s1(this,mh),s1(this,mp),s1(this,mb),s1(this,ma,!1),s1(this,mr,void 0),s1(this,mm,()=>{var e,t;this.submenuElement.items&&this.setAttribute("submenusize",`${this.submenuElement.items.length}`);let i=this.shadowRoot.querySelector('slot[name="description"]'),a=null==(e=this.submenuElement.checkedItems)?void 0:e[0],r=null!=(t=null==a?void 0:a.dataset.description)?t:null==a?void 0:a.text,n=iu.createElement("span");n.textContent=null!=r?r:"",i.replaceChildren(n)}),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);const e=ib(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e)}this.shadowRoot.addEventListener("slotchange",this)}static get observedAttributes(){return[s4,s8,s9,s5]}enable(){this.hasAttribute("tabindex")||this.setAttribute("tabindex","-1"),s7(this)&&!this.hasAttribute("aria-checked")&&this.setAttribute("aria-checked","false"),this.addEventListener("click",this),this.addEventListener("keydown",this)}disable(){this.removeAttribute("tabindex"),this.removeEventListener("click",this),this.removeEventListener("keydown",this),this.removeEventListener("keyup",this)}handleEvent(e){switch(e.type){case"slotchange":s3(this,mn,ms).call(this,e);break;case"click":this.handleClick(e);break;case"keydown":s3(this,mp,mv).call(this,e);break;case"keyup":s3(this,mh,mc).call(this,e)}}attributeChangedCallback(e,t,i){e===s9&&s7(this)&&!s0(this,ma)?this.setAttribute("aria-checked",null!=i?"true":"false"):e===s4&&i!==t?this.role="menuitem"+i:e===s8&&i!==t&&(null==i?this.enable():this.disable())}connectedCallback(){this.hasAttribute(s8)||this.enable(),this.role="menuitem"+this.type,s2(this,mr,function e(t,i){if(!t)return null;let{host:a}=t.getRootNode();return!i&&a?e(t,a):(null==i?void 0:i.items)?i:e(i,null==i?void 0:i.parentNode)}(this,this.parentNode)),s3(this,mb,mE).call(this),this.submenuElement&&s3(this,mo,ml).call(this)}disconnectedCallback(){this.disable(),s3(this,mb,mE).call(this),s2(this,mr,null)}get invokeTarget(){return this.getAttribute("invoketarget")}set invokeTarget(e){this.setAttribute("invoketarget",`${e}`)}get invokeTargetElement(){var e;return this.invokeTarget?null==(e=iw(this))?void 0:e.querySelector(`#${this.invokeTarget}`):this.submenuElement}get submenuElement(){return this.shadowRoot.querySelector('slot[name="submenu"]').assignedElements({flatten:!0})[0]}get type(){var e;return null!=(e=this.getAttribute(s4))?e:""}set type(e){this.setAttribute(s4,`${e}`)}get value(){var e;return null!=(e=this.getAttribute(s5))?e:this.text}set value(e){this.setAttribute(s5,e)}get text(){var e;return(null!=(e=this.textContent)?e:"").trim()}get checked(){if(s7(this))return"true"===this.getAttribute("aria-checked")}set checked(e){s7(this)&&(s2(this,ma,!0),this.setAttribute("aria-checked",e?"true":"false"),e?this.part.add("checked"):this.part.remove("checked"))}handleClick(e){!s7(this)&&this.invokeTargetElement&&iT(this,e.target)&&this.invokeTargetElement.dispatchEvent(new sW({relatedTarget:this}))}get keysUsed(){return["Enter"," "]}}function s7(e){return"radio"===e.type||"checkbox"===e.type}ma=new WeakMap,mr=new WeakMap,mn=new WeakSet,ms=function(e){let t=e.target;if(!(null==t?void 0:t.name))for(let e of t.assignedNodes({flatten:!0}))e instanceof Text&&""===e.textContent.trim()&&e.remove();"submenu"===t.name&&(this.submenuElement?s3(this,mo,ml).call(this):s3(this,md,mu).call(this))},mo=new WeakSet,ml=async function(){this.setAttribute("aria-haspopup","menu"),this.setAttribute("aria-expanded",`${!this.submenuElement.hidden}`),this.submenuElement.addEventListener("change",s0(this,mm)),this.submenuElement.addEventListener("addmenuitem",s0(this,mm)),this.submenuElement.addEventListener("removemenuitem",s0(this,mm)),s0(this,mm).call(this)},md=new WeakSet,mu=function(){this.removeAttribute("aria-haspopup"),this.removeAttribute("aria-expanded"),this.submenuElement.removeEventListener("change",s0(this,mm)),this.submenuElement.removeEventListener("addmenuitem",s0(this,mm)),this.submenuElement.removeEventListener("removemenuitem",s0(this,mm)),s0(this,mm).call(this)},mm=new WeakMap,mh=new WeakSet,mc=function(e){let{key:t}=e;this.keysUsed.includes(t)?this.handleClick(e):this.removeEventListener("keyup",s3(this,mh,mc))},mp=new WeakSet,mv=function(e){let{metaKey:t,altKey:i,key:a}=e;t||i||!this.keysUsed.includes(a)?this.removeEventListener("keyup",s3(this,mh,mc)):this.addEventListener("keyup",s3(this,mh,mc),{once:!0})},mb=new WeakSet,mE=function(){var e;let t=null==(e=s0(this,mr))?void 0:e.radioGroupItems;if(!t)return;let i=t.filter(e=>"true"===e.getAttribute("aria-checked")).pop();for(let e of(i||(i=t[0]),t))e.setAttribute("aria-checked","false");null==i||i.setAttribute("aria-checked","true")},s6.shadowRootOptions={mode:"open"},s6.getTemplateHTML=function(e){return`
    <style>
      :host {
        transition: var(--media-menu-item-transition,
          background .15s linear,
          opacity .2s ease-in-out
        );
        outline: var(--media-menu-item-outline, 0);
        outline-offset: var(--media-menu-item-outline-offset, -1px);
        cursor: var(--media-cursor, pointer);
        display: flex;
        align-items: center;
        align-self: stretch;
        justify-self: stretch;
        white-space: nowrap;
        white-space-collapse: collapse;
        text-wrap: nowrap;
        padding: .4em .8em .4em 1em;
      }

      :host(:focus-visible) {
        box-shadow: var(--media-menu-item-focus-shadow, inset 0 0 0 2px rgb(27 127 204 / .9));
        outline: var(--media-menu-item-hover-outline, 0);
        outline-offset: var(--media-menu-item-hover-outline-offset,  var(--media-menu-item-outline-offset, -1px));
      }

      :host(:hover) {
        cursor: var(--media-cursor, pointer);
        background: var(--media-menu-item-hover-background, rgb(92 92 102 / .5));
        outline: var(--media-menu-item-hover-outline);
        outline-offset: var(--media-menu-item-hover-outline-offset,  var(--media-menu-item-outline-offset, -1px));
      }

      :host([aria-checked="true"]) {
        background: var(--media-menu-item-checked-background);
      }

      :host([hidden]) {
        display: none;
      }

      :host([disabled]) {
        pointer-events: none;
        color: rgba(255, 255, 255, .3);
      }

      slot:not([name]) {
        width: 100%;
      }

      slot:not([name="submenu"]) {
        display: inline-flex;
        align-items: center;
        transition: inherit;
        opacity: var(--media-menu-item-opacity, 1);
      }

      slot[name="description"] {
        justify-content: end;
      }

      slot[name="description"] > span {
        display: inline-block;
        margin-inline: 1em .2em;
        max-width: var(--media-menu-item-description-max-width, 100px);
        text-overflow: ellipsis;
        overflow: hidden;
        font-size: .8em;
        font-weight: 400;
        text-align: right;
        position: relative;
        top: .04em;
      }

      slot[name="checked-indicator"] {
        display: none;
      }

      :host(:is([role="menuitemradio"],[role="menuitemcheckbox"])) slot[name="checked-indicator"] {
        display: var(--media-menu-item-checked-indicator-display, inline-block);
      }

      
      svg, img, ::slotted(svg), ::slotted(img) {
        height: var(--media-menu-item-icon-height, var(--media-control-height, 24px));
        fill: var(--media-icon-color, var(--media-primary-color, rgb(238 238 238)));
        display: block;
      }

      
      [part~="indicator"],
      ::slotted([part~="indicator"]) {
        fill: var(--media-menu-item-indicator-fill,
          var(--media-icon-color, var(--media-primary-color, rgb(238 238 238))));
        height: var(--media-menu-item-indicator-height, 1.25em);
        margin-right: .5ch;
      }

      [part~="checked-indicator"] {
        visibility: hidden;
      }

      :host([aria-checked="true"]) [part~="checked-indicator"] {
        visibility: visible;
      }
    </style>
    <slot name="checked-indicator">
      <svg aria-hidden="true" viewBox="0 1 24 24" part="checked-indicator indicator">
        <path d="m10 15.17 9.193-9.191 1.414 1.414-10.606 10.606-6.364-6.364 1.414-1.414 4.95 4.95Z"/>
      </svg>
    </slot>
    <slot name="prefix"></slot>
    <slot></slot>
    <slot name="description"></slot>
    <slot name="suffix">
      ${this.getSuffixSlotInnerHTML(e)}
    </slot>
    <slot name="submenu"></slot>
  `},s6.getSuffixSlotInnerHTML=function(e){return""},id.customElements.get("media-chrome-menu-item")||id.customElements.define("media-chrome-menu-item",s6);class oe extends sQ{get anchorElement(){return"auto"!==this.anchor?super.anchorElement:iE(this).querySelector("media-settings-menu-button")}}oe.getTemplateHTML=function(e){return`
    ${sQ.getTemplateHTML(e)}
    <style>
      :host {
        --_menu-bg: rgb(20 20 30 / .8);
        background: var(--media-settings-menu-background,
            var(--media-menu-background,
              var(--media-control-background,
                var(--media-secondary-color, var(--_menu-bg)))));
        min-width: var(--media-settings-menu-min-width, 170px);
        border-radius: 2px 2px 0 0;
        overflow: hidden;
      }

      @-moz-document url-prefix() {
        :host{
          --_menu-bg: rgb(20 20 30);
        }
      }

      :host([role="menu"]) {
        
        justify-content: end;
      }

      slot:not([name]) {
        justify-content: var(--media-settings-menu-justify-content);
        flex-direction: var(--media-settings-menu-flex-direction, column);
        overflow: visible;
      }

      #container.has-expanded {
        --media-settings-menu-item-opacity: 0;
      }
    </style>
  `},id.customElements.get("media-settings-menu")||id.customElements.define("media-settings-menu",oe);class ot extends s6{}ot.shadowRootOptions={mode:"open"},ot.getTemplateHTML=function(e){return`
    ${s6.getTemplateHTML.call(this,e)}
    <style>
      slot:not([name="submenu"]) {
        opacity: var(--media-settings-menu-item-opacity, var(--media-menu-item-opacity));
      }

      :host([aria-expanded="true"]:hover) {
        background: transparent;
      }
    </style>
  `},ot.getSuffixSlotInnerHTML=function(e){return`
    <svg aria-hidden="true" viewBox="0 0 20 24">
      <path d="m8.12 17.585-.742-.669 4.2-4.665-4.2-4.666.743-.669 4.803 5.335-4.803 5.334Z"/>
    </svg>
  `},id.customElements.get("media-settings-menu-item")||id.customElements.define("media-settings-menu-item",ot);class oi extends rc{connectedCallback(){super.connectedCallback(),this.invokeTargetElement&&this.setAttribute("aria-haspopup","menu")}get invokeTarget(){return this.getAttribute("invoketarget")}set invokeTarget(e){this.setAttribute("invoketarget",`${e}`)}get invokeTargetElement(){var e;return this.invokeTarget?null==(e=iw(this))?void 0:e.querySelector(`#${this.invokeTarget}`):null}handleClick(){var e;null==(e=this.invokeTargetElement)||e.dispatchEvent(new sW({relatedTarget:this}))}}id.customElements.get("media-chrome-menu-button")||id.customElements.define("media-chrome-menu-button",oi);class oa extends oi{static get observedAttributes(){return[...super.observedAttributes,"target"]}connectedCallback(){super.connectedCallback(),this.setAttribute("aria-label",ie("settings"))}get invokeTargetElement(){return void 0!=this.invokeTarget?super.invokeTargetElement:iE(this).querySelector("media-settings-menu")}}oa.getSlotTemplateHTML=function(){return`
    <style>
      :host([aria-expanded="true"]) slot[name=tooltip] {
        display: none;
      }
    </style>
    <slot name="icon">
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M4.5 14.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm7.5 0a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm7.5 0a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/>
      </svg>
    </slot>
  `},oa.getTooltipContentHTML=function(){return ie("Settings")},id.customElements.get("media-settings-menu-button")||id.customElements.define("media-settings-menu-button",oa);var or=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},on=(e,t,i)=>(or(e,t,"read from private field"),i?i.call(e):t.get(e)),os=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},oo=(e,t,i,a)=>(or(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i),ol=(e,t,i)=>(or(e,t,"access private method"),i);mg=new WeakMap,mf=new WeakMap,mA=new WeakSet,my=function(){if(on(this,mf)===JSON.stringify(this.mediaAudioTrackList))return;oo(this,mf,JSON.stringify(this.mediaAudioTrackList));let e=this.mediaAudioTrackList;for(let t of(this.defaultSlot.textContent="",e.sort((e,t)=>e.id.localeCompare(t.id,void 0,{numeric:!0})),e)){let e=sY({type:"radio",text:this.formatMenuItemText(t.label,t),value:`${t.id}`,checked:t.enabled});e.prepend(sG(this,"checked-indicator")),this.defaultSlot.append(e)}},mT=new WeakSet,mk=function(){if(null==this.value)return;let e=new id.CustomEvent(tN.MEDIA_AUDIO_TRACK_REQUEST,{composed:!0,bubbles:!0,detail:this.value});this.dispatchEvent(e)},id.customElements.get("media-audio-track-menu")||id.customElements.define("media-audio-track-menu",class extends sQ{constructor(){super(...arguments),os(this,mA),os(this,mT),os(this,mg,[]),os(this,mf,void 0)}static get observedAttributes(){return[...super.observedAttributes,tW.MEDIA_AUDIO_TRACK_LIST,tW.MEDIA_AUDIO_TRACK_ENABLED,tW.MEDIA_AUDIO_TRACK_UNAVAILABLE]}attributeChangedCallback(e,t,i){if(super.attributeChangedCallback(e,t,i),e===tW.MEDIA_AUDIO_TRACK_ENABLED&&t!==i)this.value=i;else if(e===tW.MEDIA_AUDIO_TRACK_LIST&&t!==i){var a;oo(this,mg,null==(a=null!=i?i:"")?void 0:a.split(/\s+/).map(tJ)),ol(this,mA,my).call(this)}}connectedCallback(){super.connectedCallback(),this.addEventListener("change",ol(this,mT,mk))}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("change",ol(this,mT,mk))}get anchorElement(){var e;return"auto"!==this.anchor?super.anchorElement:null==(e=iE(this))?void 0:e.querySelector("media-audio-track-menu-button")}get mediaAudioTrackList(){return on(this,mg)}set mediaAudioTrackList(e){oo(this,mg,e),ol(this,mA,my).call(this)}get mediaAudioTrackEnabled(){var e;return null!=(e=ix(this,tW.MEDIA_AUDIO_TRACK_ENABLED))?e:""}set mediaAudioTrackEnabled(e){iN(this,tW.MEDIA_AUDIO_TRACK_ENABLED,e)}});let od=`<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="M11 17H9.5V7H11v10Zm-3-3H6.5v-4H8v4Zm6-5h-1.5v6H14V9Zm3 7h-1.5V8H17v8Z"/>
  <path d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Zm-2 0a8 8 0 1 0-16 0 8 8 0 0 0 16 0Z"/>
</svg>`,ou=e=>{let t=ie("Audio");e.setAttribute("aria-label",t)};class om extends oi{static get observedAttributes(){return[...super.observedAttributes,tW.MEDIA_AUDIO_TRACK_ENABLED,tW.MEDIA_AUDIO_TRACK_UNAVAILABLE]}connectedCallback(){super.connectedCallback(),ou(this)}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),e===tW.MEDIA_LANG&&ou(this)}get invokeTargetElement(){var e;return void 0!=this.invokeTarget?super.invokeTargetElement:null==(e=iE(this))?void 0:e.querySelector("media-audio-track-menu")}get mediaAudioTrackEnabled(){var e;return null!=(e=ix(this,tW.MEDIA_AUDIO_TRACK_ENABLED))?e:""}set mediaAudioTrackEnabled(e){iN(this,tW.MEDIA_AUDIO_TRACK_ENABLED,e)}}om.getSlotTemplateHTML=function(){return`
    <style>
      :host([aria-expanded="true"]) slot[name=tooltip] {
        display: none;
      }
    </style>
    <slot name="icon">${od}</slot>
  `},om.getTooltipContentHTML=function(){return ie("Audio")},id.customElements.get("media-audio-track-menu-button")||id.customElements.define("media-audio-track-menu-button",om);var oh=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},oc=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},op=(e,t,i)=>(oh(e,t,"access private method"),i);let ov=`
  <svg aria-hidden="true" viewBox="0 0 26 24" part="captions-indicator indicator">
    <path d="M22.83 5.68a2.58 2.58 0 0 0-2.3-2.5c-3.62-.24-11.44-.24-15.06 0a2.58 2.58 0 0 0-2.3 2.5c-.23 4.21-.23 8.43 0 12.64a2.58 2.58 0 0 0 2.3 2.5c3.62.24 11.44.24 15.06 0a2.58 2.58 0 0 0 2.3-2.5c.23-4.21.23-8.43 0-12.64Zm-11.39 9.45a3.07 3.07 0 0 1-1.91.57 3.06 3.06 0 0 1-2.34-1 3.75 3.75 0 0 1-.92-2.67 3.92 3.92 0 0 1 .92-2.77 3.18 3.18 0 0 1 2.43-1 2.94 2.94 0 0 1 2.13.78c.364.359.62.813.74 1.31l-1.43.35a1.49 1.49 0 0 0-1.51-1.17 1.61 1.61 0 0 0-1.29.58 2.79 2.79 0 0 0-.5 1.89 3 3 0 0 0 .49 1.93 1.61 1.61 0 0 0 1.27.58 1.48 1.48 0 0 0 1-.37 2.1 2.1 0 0 0 .59-1.14l1.4.44a3.23 3.23 0 0 1-1.07 1.69Zm7.22 0a3.07 3.07 0 0 1-1.91.57 3.06 3.06 0 0 1-2.34-1 3.75 3.75 0 0 1-.92-2.67 3.88 3.88 0 0 1 .93-2.77 3.14 3.14 0 0 1 2.42-1 3 3 0 0 1 2.16.82 2.8 2.8 0 0 1 .73 1.31l-1.43.35a1.49 1.49 0 0 0-1.51-1.21 1.61 1.61 0 0 0-1.29.58A2.79 2.79 0 0 0 15 12a3 3 0 0 0 .49 1.93 1.61 1.61 0 0 0 1.27.58 1.44 1.44 0 0 0 1-.37 2.1 2.1 0 0 0 .6-1.15l1.4.44a3.17 3.17 0 0 1-1.1 1.7Z"/>
  </svg>`;class ob extends sQ{constructor(){super(...arguments),oc(this,mw),oc(this,mR),oc(this,m_,void 0)}static get observedAttributes(){return[...super.observedAttributes,tW.MEDIA_SUBTITLES_LIST,tW.MEDIA_SUBTITLES_SHOWING]}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),e===tW.MEDIA_SUBTITLES_LIST&&t!==i?op(this,mw,mI).call(this):e===tW.MEDIA_SUBTITLES_SHOWING&&t!==i&&(this.value=i||"",op(this,mw,mI).call(this))}connectedCallback(){super.connectedCallback(),this.addEventListener("change",op(this,mR,mC))}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("change",op(this,mR,mC))}get anchorElement(){return"auto"!==this.anchor?super.anchorElement:iE(this).querySelector("media-captions-menu-button")}get mediaSubtitlesList(){return oE(this,tW.MEDIA_SUBTITLES_LIST)}set mediaSubtitlesList(e){og(this,tW.MEDIA_SUBTITLES_LIST,e)}get mediaSubtitlesShowing(){return oE(this,tW.MEDIA_SUBTITLES_SHOWING)}set mediaSubtitlesShowing(e){og(this,tW.MEDIA_SUBTITLES_SHOWING,e)}}m_=new WeakMap,mw=new WeakSet,mI=function(){var e,t,i,a,r,n;let s=(oh(this,t=m_,"read from private field"),(i?i.call(this):t.get(this))!==JSON.stringify(this.mediaSubtitlesList)),o=this.value!==this.getAttribute(tW.MEDIA_SUBTITLES_SHOWING);if(!s&&!o)return;a=m_,r=JSON.stringify(this.mediaSubtitlesList),oh(this,a,"write to private field"),n?n.call(this,r):a.set(this,r),this.defaultSlot.textContent="";let l=!this.value,d=sY({type:"radio",text:this.formatMenuItemText(ie("Off")),value:"off",checked:l});for(let t of(d.prepend(sG(this,"checked-indicator")),this.defaultSlot.append(d),this.mediaSubtitlesList)){let i=sY({type:"radio",text:this.formatMenuItemText(t.label,t),value:i7(t),checked:this.value==i7(t)});i.prepend(sG(this,"checked-indicator")),"captions"===(null!=(e=t.kind)?e:"subs")&&i.append(sG(this,"captions-indicator")),this.defaultSlot.append(i)}},mR=new WeakSet,mC=function(){let e=this.mediaSubtitlesShowing,t=this.getAttribute(tW.MEDIA_SUBTITLES_SHOWING),i=this.value!==t;if((null==e?void 0:e.length)&&i&&this.dispatchEvent(new id.CustomEvent(tN.MEDIA_DISABLE_SUBTITLES_REQUEST,{composed:!0,bubbles:!0,detail:e})),!this.value||!i)return;let a=new id.CustomEvent(tN.MEDIA_SHOW_SUBTITLES_REQUEST,{composed:!0,bubbles:!0,detail:this.value});this.dispatchEvent(a)},ob.getTemplateHTML=function(e){return`
    ${sQ.getTemplateHTML(e)}
    <slot name="captions-indicator" hidden>${ov}</slot>
  `};let oE=(e,t)=>{let i=e.getAttribute(t);return i?i8(i):[]},og=(e,t,i)=>{if(!(null==i?void 0:i.length))return void e.removeAttribute(t);let a=ae(i);e.getAttribute(t)!==a&&e.setAttribute(t,a)};id.customElements.get("media-captions-menu")||id.customElements.define("media-captions-menu",ob);let of=`<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M22.83 5.68a2.58 2.58 0 0 0-2.3-2.5c-3.62-.24-11.44-.24-15.06 0a2.58 2.58 0 0 0-2.3 2.5c-.23 4.21-.23 8.43 0 12.64a2.58 2.58 0 0 0 2.3 2.5c3.62.24 11.44.24 15.06 0a2.58 2.58 0 0 0 2.3-2.5c.23-4.21.23-8.43 0-12.64Zm-11.39 9.45a3.07 3.07 0 0 1-1.91.57 3.06 3.06 0 0 1-2.34-1 3.75 3.75 0 0 1-.92-2.67 3.92 3.92 0 0 1 .92-2.77 3.18 3.18 0 0 1 2.43-1 2.94 2.94 0 0 1 2.13.78c.364.359.62.813.74 1.31l-1.43.35a1.49 1.49 0 0 0-1.51-1.17 1.61 1.61 0 0 0-1.29.58 2.79 2.79 0 0 0-.5 1.89 3 3 0 0 0 .49 1.93 1.61 1.61 0 0 0 1.27.58 1.48 1.48 0 0 0 1-.37 2.1 2.1 0 0 0 .59-1.14l1.4.44a3.23 3.23 0 0 1-1.07 1.69Zm7.22 0a3.07 3.07 0 0 1-1.91.57 3.06 3.06 0 0 1-2.34-1 3.75 3.75 0 0 1-.92-2.67 3.88 3.88 0 0 1 .93-2.77 3.14 3.14 0 0 1 2.42-1 3 3 0 0 1 2.16.82 2.8 2.8 0 0 1 .73 1.31l-1.43.35a1.49 1.49 0 0 0-1.51-1.21 1.61 1.61 0 0 0-1.29.58A2.79 2.79 0 0 0 15 12a3 3 0 0 0 .49 1.93 1.61 1.61 0 0 0 1.27.58 1.44 1.44 0 0 0 1-.37 2.1 2.1 0 0 0 .6-1.15l1.4.44a3.17 3.17 0 0 1-1.1 1.7Z"/>
</svg>`,oA=`<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M17.73 14.09a1.4 1.4 0 0 1-1 .37 1.579 1.579 0 0 1-1.27-.58A3 3 0 0 1 15 12a2.8 2.8 0 0 1 .5-1.85 1.63 1.63 0 0 1 1.29-.57 1.47 1.47 0 0 1 1.51 1.2l1.43-.34A2.89 2.89 0 0 0 19 9.07a3 3 0 0 0-2.14-.78 3.14 3.14 0 0 0-2.42 1 3.91 3.91 0 0 0-.93 2.78 3.74 3.74 0 0 0 .92 2.66 3.07 3.07 0 0 0 2.34 1 3.07 3.07 0 0 0 1.91-.57 3.17 3.17 0 0 0 1.07-1.74l-1.4-.45c-.083.43-.3.822-.62 1.12Zm-7.22 0a1.43 1.43 0 0 1-1 .37 1.58 1.58 0 0 1-1.27-.58A3 3 0 0 1 7.76 12a2.8 2.8 0 0 1 .5-1.85 1.63 1.63 0 0 1 1.29-.57 1.47 1.47 0 0 1 1.51 1.2l1.43-.34a2.81 2.81 0 0 0-.74-1.32 2.94 2.94 0 0 0-2.13-.78 3.18 3.18 0 0 0-2.43 1 4 4 0 0 0-.92 2.78 3.74 3.74 0 0 0 .92 2.66 3.07 3.07 0 0 0 2.34 1 3.07 3.07 0 0 0 1.91-.57 3.23 3.23 0 0 0 1.07-1.74l-1.4-.45a2.06 2.06 0 0 1-.6 1.07Zm12.32-8.41a2.59 2.59 0 0 0-2.3-2.51C18.72 3.05 15.86 3 13 3c-2.86 0-5.72.05-7.53.17a2.59 2.59 0 0 0-2.3 2.51c-.23 4.207-.23 8.423 0 12.63a2.57 2.57 0 0 0 2.3 2.5c1.81.13 4.67.19 7.53.19 2.86 0 5.72-.06 7.53-.19a2.57 2.57 0 0 0 2.3-2.5c.23-4.207.23-8.423 0-12.63Zm-1.49 12.53a1.11 1.11 0 0 1-.91 1.11c-1.67.11-4.45.18-7.43.18-2.98 0-5.76-.07-7.43-.18a1.11 1.11 0 0 1-.91-1.11c-.21-4.14-.21-8.29 0-12.43a1.11 1.11 0 0 1 .91-1.11C7.24 4.56 10 4.49 13 4.49s5.76.07 7.43.18a1.11 1.11 0 0 1 .91 1.11c.21 4.14.21 8.29 0 12.43Z"/>
</svg>`,oy=e=>{e.setAttribute("data-captions-enabled",ar(e).toString())},oT=e=>{e.setAttribute("aria-label",ie("closed captions"))};class ok extends oi{static get observedAttributes(){return[...super.observedAttributes,tW.MEDIA_SUBTITLES_LIST,tW.MEDIA_SUBTITLES_SHOWING,tW.MEDIA_LANG]}connectedCallback(){super.connectedCallback(),oT(this),oy(this)}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),e===tW.MEDIA_SUBTITLES_SHOWING?oy(this):e===tW.MEDIA_LANG&&oT(this)}get invokeTargetElement(){var e;return void 0!=this.invokeTarget?super.invokeTargetElement:null==(e=iE(this))?void 0:e.querySelector("media-captions-menu")}get mediaSubtitlesList(){return o_(this,tW.MEDIA_SUBTITLES_LIST)}set mediaSubtitlesList(e){ow(this,tW.MEDIA_SUBTITLES_LIST,e)}get mediaSubtitlesShowing(){return o_(this,tW.MEDIA_SUBTITLES_SHOWING)}set mediaSubtitlesShowing(e){ow(this,tW.MEDIA_SUBTITLES_SHOWING,e)}}ok.getSlotTemplateHTML=function(){return`
    <style>
      :host([data-captions-enabled="true"]) slot[name=off] {
        display: none !important;
      }

      
      :host(:not([data-captions-enabled="true"])) slot[name=on] {
        display: none !important;
      }

      :host([aria-expanded="true"]) slot[name=tooltip] {
        display: none;
      }
    </style>

    <slot name="icon">
      <slot name="on">${of}</slot>
      <slot name="off">${oA}</slot>
    </slot>
  `},ok.getTooltipContentHTML=function(){return ie("Captions")};let o_=(e,t)=>{let i=e.getAttribute(t);return i?i8(i):[]},ow=(e,t,i)=>{if(!(null==i?void 0:i.length))return void e.removeAttribute(t);let a=ae(i);e.getAttribute(t)!==a&&e.setAttribute(t,a)};id.customElements.get("media-captions-menu-button")||id.customElements.define("media-captions-menu-button",ok);var oI=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},oR=(e,t,i)=>(oI(e,t,"read from private field"),i?i.call(e):t.get(e)),oC=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},oS=(e,t,i)=>(oI(e,t,"access private method"),i);let oM="rates";mS=new WeakMap,mM=new WeakSet,mL=function(){this.defaultSlot.textContent="";let e=this.mediaPlaybackRate,t=new Set(Array.from(oR(this,mS)).map(e=>Number(e)));for(let i of(e>0&&!t.has(e)&&t.add(e),Array.from(t).sort((e,t)=>e-t))){let t=sY({type:"radio",text:this.formatMenuItemText(`${i}x`,i),value:i.toString(),checked:e===i});t.prepend(sG(this,"checked-indicator")),this.defaultSlot.append(t)}},mD=new WeakSet,mx=function(){if(!this.value)return;let e=new id.CustomEvent(tN.MEDIA_PLAYBACK_RATE_REQUEST,{composed:!0,bubbles:!0,detail:this.value});this.dispatchEvent(e)},id.customElements.get("media-playback-rate-menu")||id.customElements.define("media-playback-rate-menu",class extends sQ{constructor(){super(),oC(this,mM),oC(this,mD),oC(this,mS,new i5(this,oM,{defaultValue:n_})),oS(this,mM,mL).call(this)}static get observedAttributes(){return[...super.observedAttributes,tW.MEDIA_PLAYBACK_RATE,oM]}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),e===tW.MEDIA_PLAYBACK_RATE&&t!=i?(this.value=i,oS(this,mM,mL).call(this)):e===oM&&t!=i&&(oR(this,mS).value=i,oS(this,mM,mL).call(this))}connectedCallback(){super.connectedCallback(),this.addEventListener("change",oS(this,mD,mx))}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("change",oS(this,mD,mx))}get anchorElement(){return"auto"!==this.anchor?super.anchorElement:iE(this).querySelector("media-playback-rate-menu-button")}get rates(){return oR(this,mS)}set rates(e){e?Array.isArray(e)?oR(this,mS).value=e.join(" "):"string"==typeof e&&(oR(this,mS).value=e):oR(this,mS).value="",oS(this,mM,mL).call(this)}get mediaPlaybackRate(){return iS(this,tW.MEDIA_PLAYBACK_RATE,1)}set mediaPlaybackRate(e){iM(this,tW.MEDIA_PLAYBACK_RATE,e)}});class oL extends oi{static get observedAttributes(){return[...super.observedAttributes,tW.MEDIA_PLAYBACK_RATE]}constructor(){var e;super(),this.container=this.shadowRoot.querySelector('slot[name="icon"]'),this.container.innerHTML=`${null!=(e=this.mediaPlaybackRate)?e:1}x`}attributeChangedCallback(e,t,i){if(super.attributeChangedCallback(e,t,i),e===tW.MEDIA_PLAYBACK_RATE){let e=i?+i:NaN,t=Number.isNaN(e)?1:e;this.container.innerHTML=`${t}x`,this.setAttribute("aria-label",ie("Playback rate {playbackRate}",{playbackRate:t}))}}get invokeTargetElement(){return void 0!=this.invokeTarget?super.invokeTargetElement:iE(this).querySelector("media-playback-rate-menu")}get mediaPlaybackRate(){return iS(this,tW.MEDIA_PLAYBACK_RATE,1)}set mediaPlaybackRate(e){iM(this,tW.MEDIA_PLAYBACK_RATE,e)}}oL.getSlotTemplateHTML=function(e){return`
    <style>
      :host {
        min-width: 5ch;
        padding: var(--media-button-padding, var(--media-control-padding, 10px 5px));
      }
      
      :host([aria-expanded="true"]) slot {
        display: block;
      }

      :host([aria-expanded="true"]) slot[name=tooltip] {
        display: none;
      }
    </style>
    <slot name="icon">${e.mediaplaybackrate||1}x</slot>
  `},oL.getTooltipContentHTML=function(){return ie("Playback rate")},id.customElements.get("media-playback-rate-menu-button")||id.customElements.define("media-playback-rate-menu-button",oL);var oD=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},ox=(e,t,i)=>(oD(e,t,"read from private field"),i?i.call(e):t.get(e)),oN=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},oO=(e,t,i,a)=>(oD(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i),oP=(e,t,i)=>(oD(e,t,"access private method"),i);mN=new WeakMap,mO=new WeakMap,mP=new WeakSet,mU=function(){if(ox(this,mO).mediaRenditionList===JSON.stringify(this.mediaRenditionList)&&ox(this,mO).mediaHeight===this.mediaHeight)return;ox(this,mO).mediaRenditionList=JSON.stringify(this.mediaRenditionList),ox(this,mO).mediaHeight=this.mediaHeight;let e=this.mediaRenditionList.sort(this.compareRendition.bind(this)),t=e.find(e=>e.id===this.mediaRenditionSelected);for(let i of e)i.selected=i===t;this.defaultSlot.textContent="";let i=!this.mediaRenditionSelected;for(let t of e){let e=sY({type:"radio",text:this.formatRendition(t,{showBitrate:this.showRenditionBitrate(t)}),value:`${t.id}`,checked:t.selected&&!i});e.prepend(sG(this,"checked-indicator")),this.defaultSlot.append(e)}let a=t&&this.showRenditionBitrate(t),r=i?t?this.formatMenuItemText(`${ie("Auto")} \u2022 ${this.formatRendition(t,{showBitrate:a})}`,t):this.formatMenuItemText(`${ie("Auto")} (${this.mediaHeight}p)`):this.formatMenuItemText(ie("Auto")),n=sY({type:"radio",text:r,value:"auto",checked:i});n.dataset.description=r,n.prepend(sG(this,"checked-indicator")),this.defaultSlot.append(n)},mW=new WeakSet,m$=function(){if(null==this.value)return;let e=new id.CustomEvent(tN.MEDIA_RENDITION_REQUEST,{composed:!0,bubbles:!0,detail:this.value});this.dispatchEvent(e)},id.customElements.get("media-rendition-menu")||id.customElements.define("media-rendition-menu",class extends sQ{constructor(){super(...arguments),oN(this,mP),oN(this,mW),oN(this,mN,[]),oN(this,mO,{})}static get observedAttributes(){return[...super.observedAttributes,tW.MEDIA_RENDITION_LIST,tW.MEDIA_RENDITION_SELECTED,tW.MEDIA_RENDITION_UNAVAILABLE,tW.MEDIA_HEIGHT]}static formatMenuItemText(e,t){return super.formatMenuItemText(e,t)}static formatRendition(e,{showBitrate:t=!1}={}){let i=`${Math.min(e.width,e.height)}p`;if(t&&e.bitrate){let t=e.bitrate/1e6,a=`${t.toFixed(+(t<1))} Mbps`;return`${i} (${a})`}return this.formatMenuItemText(i,e)}static compareRendition(e,t){var i,a;return t.height===e.height?(null!=(i=t.bitrate)?i:0)-(null!=(a=e.bitrate)?a:0):t.height-e.height}attributeChangedCallback(e,t,i){if(super.attributeChangedCallback(e,t,i),e===tW.MEDIA_RENDITION_SELECTED&&t!==i)this.value=null!=i?i:"auto",oP(this,mP,mU).call(this);else if(e===tW.MEDIA_RENDITION_LIST&&t!==i)oO(this,mN,null==i?void 0:i.split(/\s+/).map(tz)),oP(this,mP,mU).call(this);else e===tW.MEDIA_HEIGHT&&t!==i&&oP(this,mP,mU).call(this)}connectedCallback(){super.connectedCallback(),this.addEventListener("change",oP(this,mW,m$))}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("change",oP(this,mW,m$))}get anchorElement(){return"auto"!==this.anchor?super.anchorElement:iE(this).querySelector("media-rendition-menu-button")}get mediaRenditionList(){return ox(this,mN)}set mediaRenditionList(e){oO(this,mN,e),oP(this,mP,mU).call(this)}get mediaRenditionSelected(){return ix(this,tW.MEDIA_RENDITION_SELECTED)}set mediaRenditionSelected(e){iN(this,tW.MEDIA_RENDITION_SELECTED,e)}get mediaHeight(){return iS(this,tW.MEDIA_HEIGHT)}set mediaHeight(e){iM(this,tW.MEDIA_HEIGHT,e)}compareRendition(e,t){return this.constructor.compareRendition(e,t)}formatMenuItemText(e,t){return this.constructor.formatMenuItemText(e,t)}formatRendition(e,t){return this.constructor.formatRendition(e,t)}showRenditionBitrate(e){return this.mediaRenditionList.some(t=>t!==e&&t.height===e.height&&t.bitrate!==e.bitrate)}});let oU=`<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="M13.5 2.5h2v6h-2v-2h-11v-2h11v-2Zm4 2h4v2h-4v-2Zm-12 4h2v6h-2v-2h-3v-2h3v-2Zm4 2h12v2h-12v-2Zm1 4h2v6h-2v-2h-8v-2h8v-2Zm4 2h7v2h-7v-2Z" />
</svg>`;class oW extends oi{static get observedAttributes(){return[...super.observedAttributes,tW.MEDIA_RENDITION_SELECTED,tW.MEDIA_RENDITION_UNAVAILABLE,tW.MEDIA_HEIGHT]}connectedCallback(){super.connectedCallback(),this.setAttribute("aria-label",ie("quality"))}get invokeTargetElement(){return void 0!=this.invokeTarget?super.invokeTargetElement:iE(this).querySelector("media-rendition-menu")}get mediaRenditionSelected(){return ix(this,tW.MEDIA_RENDITION_SELECTED)}set mediaRenditionSelected(e){iN(this,tW.MEDIA_RENDITION_SELECTED,e)}get mediaHeight(){return iS(this,tW.MEDIA_HEIGHT)}set mediaHeight(e){iM(this,tW.MEDIA_HEIGHT,e)}}oW.getSlotTemplateHTML=function(){return`
    <style>
      :host([aria-expanded="true"]) slot[name=tooltip] {
        display: none;
      }
    </style>
    <slot name="icon">${oU}</slot>
  `},oW.getTooltipContentHTML=function(){return ie("Quality")},id.customElements.get("media-rendition-menu-button")||id.customElements.define("media-rendition-menu-button",oW);var o$=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},oB=(e,t,i)=>(o$(e,t,"read from private field"),i?i.call(e):t.get(e)),oH=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},oV=(e,t,i,a)=>(o$(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i),oK=(e,t,i)=>(o$(e,t,"access private method"),i);class oF extends sQ{constructor(){super(),oH(this,mH),oH(this,mK),oH(this,mY),oH(this,mq),oH(this,mQ),oH(this,mB,!1),oH(this,mZ,e=>{let t=e.target,i=(null==t?void 0:t.nodeName)==="VIDEO",a=oK(this,mq,mj).call(this,t);(i||a)&&(oB(this,mB)?oK(this,mK,mF).call(this):oK(this,mQ,mz).call(this,e))}),oH(this,mX,e=>{let t=e.target,i=this.contains(t),a=2===e.button,r=(null==t?void 0:t.nodeName)==="VIDEO",n=oK(this,mq,mj).call(this,t);i||a&&(r||n)||oK(this,mK,mF).call(this)}),oH(this,mJ,e=>{"Escape"===e.key&&oK(this,mK,mF).call(this)}),oH(this,m0,e=>{var t,i;let a=e.target;if(null==(t=a.matches)?void 0:t.call(a,'button[invoke="copy"]')){let e=null==(i=a.closest("media-context-menu-item"))?void 0:i.querySelector('input[slot="copy"]');e&&navigator.clipboard.writeText(e.value)}oK(this,mK,mF).call(this)}),this.setAttribute("noautohide",""),oK(this,mH,mV).call(this)}connectedCallback(){super.connectedCallback(),iE(this).addEventListener("contextmenu",oB(this,mZ)),this.addEventListener("click",oB(this,m0))}disconnectedCallback(){super.disconnectedCallback(),iE(this).removeEventListener("contextmenu",oB(this,mZ)),this.removeEventListener("click",oB(this,m0)),document.removeEventListener("mousedown",oB(this,mX)),document.removeEventListener("keydown",oB(this,mJ))}}mB=new WeakMap,mH=new WeakSet,mV=function(){this.hidden=!oB(this,mB)},mK=new WeakSet,mF=function(){oV(this,mB,!1),oK(this,mH,mV).call(this)},mY=new WeakSet,mG=function(){document.querySelectorAll("media-context-menu").forEach(e=>{e!==this&&oK(e,mK,mF).call(e)})},mq=new WeakSet,mj=function(e){return!!e&&(!!e.hasAttribute("slot")&&"media"===e.getAttribute("slot")||!!(e.nodeName.includes("-")&&e.tagName.includes("-"))&&(e.hasAttribute("src")||e.hasAttribute("poster")||e.hasAttribute("preload")||e.hasAttribute("playsinline")))},mZ=new WeakMap,mQ=new WeakSet,mz=function(e){e.preventDefault(),oK(this,mY,mG).call(this),oV(this,mB,!0),this.style.position="fixed",this.style.left=`${e.clientX}px`,this.style.top=`${e.clientY}px`,oK(this,mH,mV).call(this),document.addEventListener("mousedown",oB(this,mX),{once:!0}),document.addEventListener("keydown",oB(this,mJ),{once:!0})},mX=new WeakMap,mJ=new WeakMap,m0=new WeakMap,oF.getTemplateHTML=function(e){return`
      ${sQ.getTemplateHTML(e)}
      <style>
        :host {
          --_menu-bg: rgb(20 20 30 / .8);
          background: var(--media-settings-menu-background,
            var(--media-menu-background,
              var(--media-control-background,
                var(--media-secondary-color, var(--_menu-bg)))));
          min-width: var(--media-settings-menu-min-width, 170px);
          border-radius: 2px;
          overflow: hidden;
        }
      </style>
    `},id.customElements.get("media-context-menu")||id.customElements.define("media-context-menu",oF);class oY extends s6{}oY.shadowRootOptions={mode:"open"},oY.getTemplateHTML=function(e){return`
    ${s6.getTemplateHTML.call(this,e)}
    <style>
        ::slotted(*) {
            color: var(--media-text-color, white);
            text-decoration: none;
            border: none;
            background: none;
            cursor: pointer;
            padding: 0;
            min-height: var(--media-control-height, 24px);
        }
    </style>
  `},id.customElements.get("media-context-menu-item")||id.customElements.define("media-context-menu-item",oY);var oG=e=>{throw TypeError(e)},oq=(e,t,i)=>t.has(e)||oG("Cannot "+i),oj=(e,t,i)=>(oq(e,t,"read from private field"),i?i.call(e):t.get(e)),oZ=(e,t,i)=>t.has(e)?oG("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,i),oQ=(e,t,i,a)=>(oq(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i),oz=(e,t,i)=>(oq(e,t,"access private method"),i),oX=class{addEventListener(){}removeEventListener(){}dispatchEvent(e){return!0}};"u"<typeof DocumentFragment&&(globalThis.DocumentFragment=class extends oX{});var oJ,o0,o1,o2,o3,o4,o5,o9,o8,o6,o7,le,lt,li,la,lr,ln,ls,lo,ll,ld,lu,lm,lh,lc,lp,lv,lb,lE,lg,lf,lA,ly,lT,lk,l_,lw,lI,lR,lC,lS,lM,lL,lD,lx,lN,lO,lP,lU,lW,l$,lB,lH,lV,lK,lF,lY,lG,lq,lj,lZ,lQ,lz,lX,lJ,l0,l1,l2,l3,l4,l5,l9,l8,l6,l7,de,dt,di,da,dr,dn,ds,dl,dd,du,dm,dh,dc,dp,dv,db,dE,dg,df,dA,dy,dT,dk,d_,dw,dI,dR,dC,dS,dM,dL,dD,dx,dN,dO,dP,dU,dW,d$,dB,dH,dV,dK,dF,dY,dG,dq,dj,dZ,dQ,dz,dX,dJ,d0,d1,d2,d3,d4,d5,d9,d8,d6,d7,ue,ut,ui,ua,ur,un,us,uo,ul,ud,uu,um,uh,uc,up,uv,ub,uE,ug,uf,uA,uy,uT,uk,u_,uw,uI,uR,uC,uS,uM,uL,uD,ux,uN,uO,uP,uU,uW,u$,uB,uH,uV,uK,uF,uY,uG,uq,uj,uZ,uQ,uz,uX,uJ,u0,u1,u2,u3,u4,u5,u9,u8,u6,u7,me,mt,mi,ma,mr,mn,ms,mo,ml,md,mu,mm,mh,mc,mp,mv,mb,mE,mg,mf,mA,my,mT,mk,m_,mw,mI,mR,mC,mS,mM,mL,mD,mx,mN,mO,mP,mU,mW,m$,mB,mH,mV,mK,mF,mY,mG,mq,mj,mZ,mQ,mz,mX,mJ,m0,m1,m2=class extends oX{},m3=class{constructor(e,t={}){oZ(this,m1),oQ(this,m1,null==t?void 0:t.detail)}get detail(){return oj(this,m1)}initCustomEvent(){}};m1=new WeakMap;var m4={document:{createElement:function(e,t){return new m2}},DocumentFragment,customElements:{get(e){},define(e,t,i){},getName:e=>null,upgrade(e){},whenDefined:e=>Promise.resolve(m2)},CustomEvent:m3,EventTarget:oX,HTMLElement:m2,HTMLVideoElement:class extends oX{}},m5="u"<typeof window||void 0===globalThis.customElements,m9=m5?m4:globalThis,m8=m5?m4.document:globalThis.document;function m6(e){return e.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase()}function m7(e){return e.replace(/[-_]([a-z])/g,(e,t)=>t.toUpperCase())}function he(e){if(null==e)return;let t=+e;return Number.isNaN(t)?void 0:t}function ht(e){let t=(function(e){let t={};for(let i in e)null!=e[i]&&(t[i]=e[i]);return new URLSearchParams(t)})(e).toString();return t?"?"+t:""}var hi,ha,hr,hn=(e,t)=>!!e&&!!t&&(!!e.contains(t)||hn(e,t.getRootNode().host)),hs="mux.com",ho=(()=>{try{return"3.10.2"}catch{}return"UNKNOWN"})(),hl=e=>{if(e){if([m.LIVE,m.ON_DEMAND].includes(e))return e;if(null!=e&&e.includes("live"))return m.LIVE}},hd={crossorigin:"crossOrigin",playsinline:"playsInline"},hu=class{constructor(e,t){oZ(this,hi),oZ(this,ha),oZ(this,hr,[]),oQ(this,hi,e),oQ(this,ha,t)}[Symbol.iterator](){return oj(this,hr).values()}get length(){return oj(this,hr).length}get value(){var e;return null!=(e=oj(this,hr).join(" "))?e:""}set value(e){var t;e!==this.value&&(oQ(this,hr,[]),this.add(...null!=(t=null==e?void 0:e.split(" "))?t:[]))}toString(){return this.value}item(e){return oj(this,hr)[e]}values(){return oj(this,hr).values()}keys(){return oj(this,hr).keys()}forEach(e){oj(this,hr).forEach(e)}add(...e){var t,i;e.forEach(e=>{this.contains(e)||oj(this,hr).push(e)}),(""!==this.value||null!=(t=oj(this,hi))&&t.hasAttribute(`${oj(this,ha)}`))&&null!=(i=oj(this,hi))&&i.setAttribute(`${oj(this,ha)}`,`${this.value}`)}remove(...e){var t;e.forEach(e=>{oj(this,hr).splice(oj(this,hr).indexOf(e),1)}),null==(t=oj(this,hi))||t.setAttribute(`${oj(this,ha)}`,`${this.value}`)}contains(e){return oj(this,hr).includes(e)}toggle(e,t){return void 0!==t?t?(this.add(e),!0):(this.remove(e),!1):this.contains(e)?(this.remove(e),!1):(this.add(e),!0)}replace(e,t){this.remove(e),this.add(t)}};hi=new WeakMap,ha=new WeakMap,hr=new WeakMap;var hm=`[mux-player ${ho}]`;function hh(...e){console.warn(hm,...e)}function hc(...e){console.error(hm,...e)}function hp(e){var t;let i=null!=(t=e.message)?t:"";e.context&&(i+=` ${e.context}`),e.file&&(i+=` ${M("Read more: ")}
https://github.com/muxinc/elements/blob/main/errors/${e.file}`),hh(i)}var hv={AUTOPLAY:"autoplay",CROSSORIGIN:"crossorigin",LOOP:"loop",MUTED:"muted",PLAYSINLINE:"playsinline",PRELOAD:"preload"},hb={VOLUME:"volume",PLAYBACKRATE:"playbackrate",MUTED:"muted"},hE=Object.freeze({length:0,start(e){let t=e>>>0;if(t>=this.length)throw new DOMException(`Failed to execute 'start' on 'TimeRanges': The index provided (${t}) is greater than or equal to the maximum bound (${this.length}).`);return 0},end(e){let t=e>>>0;if(t>=this.length)throw new DOMException(`Failed to execute 'end' on 'TimeRanges': The index provided (${t}) is greater than or equal to the maximum bound (${this.length}).`);return 0}}),hg=[...Object.values(hv).filter(e=>hv.PLAYSINLINE!==e),...Object.values(hb)];function hf(e,t){return e.media?e.media.getAttribute(t):e.getAttribute(t)}var hA=class extends m9.HTMLElement{static get observedAttributes(){return hg}constructor(){super()}attributeChangedCallback(e,t,i){var a,r;switch(e){case hb.MUTED:this.media&&(this.media.muted=null!=i,this.media.defaultMuted=null!=i);return;case hb.VOLUME:{let e=null!=(a=he(i))?a:1;this.media&&(this.media.volume=e);return}case hb.PLAYBACKRATE:{let e=null!=(r=he(i))?r:1;this.media&&(this.media.playbackRate=e,this.media.defaultPlaybackRate=e);return}}}play(){var e,t;return null!=(t=null==(e=this.media)?void 0:e.play())?t:Promise.reject()}pause(){var e;null==(e=this.media)||e.pause()}load(){var e;null==(e=this.media)||e.load()}get media(){var e;return null==(e=this.shadowRoot)?void 0:e.querySelector("mux-video")}get audioTracks(){return this.media.audioTracks}get videoTracks(){return this.media.videoTracks}get audioRenditions(){return this.media.audioRenditions}get videoRenditions(){return this.media.videoRenditions}get paused(){var e,t;return null==(t=null==(e=this.media)?void 0:e.paused)||t}get duration(){var e,t;return null!=(t=null==(e=this.media)?void 0:e.duration)?t:NaN}get ended(){var e,t;return null!=(t=null==(e=this.media)?void 0:e.ended)&&t}get buffered(){var e,t;return null!=(t=null==(e=this.media)?void 0:e.buffered)?t:hE}get seekable(){var e,t;return null!=(t=null==(e=this.media)?void 0:e.seekable)?t:hE}get readyState(){var e,t;return null!=(t=null==(e=this.media)?void 0:e.readyState)?t:0}get videoWidth(){var e,t;return null!=(t=null==(e=this.media)?void 0:e.videoWidth)?t:0}get videoHeight(){var e,t;return null!=(t=null==(e=this.media)?void 0:e.videoHeight)?t:0}get currentSrc(){var e,t;return null!=(t=null==(e=this.media)?void 0:e.currentSrc)?t:""}get currentTime(){var e,t;return null!=(t=null==(e=this.media)?void 0:e.currentTime)?t:0}set currentTime(e){this.media&&(this.media.currentTime=Number(e))}get volume(){var e,t;return null!=(t=null==(e=this.media)?void 0:e.volume)?t:1}set volume(e){this.media&&(this.media.volume=Number(e))}get playbackRate(){var e,t;return null!=(t=null==(e=this.media)?void 0:e.playbackRate)?t:1}set playbackRate(e){this.media&&(this.media.playbackRate=Number(e))}get defaultPlaybackRate(){var e;return null!=(e=he(this.getAttribute(hb.PLAYBACKRATE)))?e:1}set defaultPlaybackRate(e){null!=e?this.setAttribute(hb.PLAYBACKRATE,`${e}`):this.removeAttribute(hb.PLAYBACKRATE)}get crossOrigin(){return hf(this,hv.CROSSORIGIN)}set crossOrigin(e){this.setAttribute(hv.CROSSORIGIN,`${e}`)}get autoplay(){return null!=hf(this,hv.AUTOPLAY)}set autoplay(e){e?this.setAttribute(hv.AUTOPLAY,"string"==typeof e?e:""):this.removeAttribute(hv.AUTOPLAY)}get loop(){return null!=hf(this,hv.LOOP)}set loop(e){e?this.setAttribute(hv.LOOP,""):this.removeAttribute(hv.LOOP)}get muted(){var e,t;return null!=(t=null==(e=this.media)?void 0:e.muted)&&t}set muted(e){this.media&&(this.media.muted=!!e)}get defaultMuted(){return null!=hf(this,hv.MUTED)}set defaultMuted(e){e?this.setAttribute(hv.MUTED,""):this.removeAttribute(hv.MUTED)}get playsInline(){return null!=hf(this,hv.PLAYSINLINE)}set playsInline(e){hc("playsInline is set to true by default and is not currently supported as a setter.")}get preload(){return this.media?this.media.preload:this.getAttribute("preload")}set preload(e){["","none","metadata","auto"].includes(e)?this.setAttribute(hv.PRELOAD,e):this.removeAttribute(hv.PRELOAD)}},hy=`:host {
  --media-control-display: var(--controls);
  --media-loading-indicator-display: var(--loading-indicator);
  --media-dialog-display: var(--dialog);
  --media-play-button-display: var(--play-button);
  --media-live-button-display: var(--live-button);
  --media-seek-backward-button-display: var(--seek-backward-button);
  --media-seek-forward-button-display: var(--seek-forward-button);
  --media-mute-button-display: var(--mute-button);
  --media-captions-button-display: var(--captions-button);
  --media-captions-menu-button-display: var(--captions-menu-button, var(--media-captions-button-display));
  --media-rendition-menu-button-display: var(--rendition-menu-button);
  --media-audio-track-menu-button-display: var(--audio-track-menu-button);
  --media-airplay-button-display: var(--airplay-button);
  --media-pip-button-display: var(--pip-button);
  --media-fullscreen-button-display: var(--fullscreen-button);
  --media-cast-button-display: var(--cast-button, var(--_cast-button-drm-display));
  --media-playback-rate-button-display: var(--playback-rate-button);
  --media-playback-rate-menu-button-display: var(--playback-rate-menu-button);
  --media-volume-range-display: var(--volume-range);
  --media-time-range-display: var(--time-range);
  --media-time-display-display: var(--time-display);
  --media-duration-display-display: var(--duration-display);
  --media-title-display-display: var(--title-display);

  display: inline-block;
  line-height: 0;
  width: 100%;
}

a {
  color: #fff;
  font-size: 0.9em;
  text-decoration: underline;
}

media-theme {
  display: inline-block;
  line-height: 0;
  width: 100%;
  height: 100%;
  direction: ltr;
}

media-poster-image {
  display: inline-block;
  line-height: 0;
  width: 100%;
  height: 100%;
}

media-poster-image:not([src]):not([placeholdersrc]) {
  display: none;
}

::part(top),
[part~='top'] {
  --media-control-display: var(--controls, var(--top-controls));
  --media-play-button-display: var(--play-button, var(--top-play-button));
  --media-live-button-display: var(--live-button, var(--top-live-button));
  --media-seek-backward-button-display: var(--seek-backward-button, var(--top-seek-backward-button));
  --media-seek-forward-button-display: var(--seek-forward-button, var(--top-seek-forward-button));
  --media-mute-button-display: var(--mute-button, var(--top-mute-button));
  --media-captions-button-display: var(--captions-button, var(--top-captions-button));
  --media-captions-menu-button-display: var(
    --captions-menu-button,
    var(--media-captions-button-display, var(--top-captions-menu-button))
  );
  --media-rendition-menu-button-display: var(--rendition-menu-button, var(--top-rendition-menu-button));
  --media-audio-track-menu-button-display: var(--audio-track-menu-button, var(--top-audio-track-menu-button));
  --media-airplay-button-display: var(--airplay-button, var(--top-airplay-button));
  --media-pip-button-display: var(--pip-button, var(--top-pip-button));
  --media-fullscreen-button-display: var(--fullscreen-button, var(--top-fullscreen-button));
  --media-cast-button-display: var(--cast-button, var(--top-cast-button, var(--_cast-button-drm-display)));
  --media-playback-rate-button-display: var(--playback-rate-button, var(--top-playback-rate-button));
  --media-playback-rate-menu-button-display: var(
    --captions-menu-button,
    var(--media-playback-rate-button-display, var(--top-playback-rate-menu-button))
  );
  --media-volume-range-display: var(--volume-range, var(--top-volume-range));
  --media-time-range-display: var(--time-range, var(--top-time-range));
  --media-time-display-display: var(--time-display, var(--top-time-display));
  --media-duration-display-display: var(--duration-display, var(--top-duration-display));
  --media-title-display-display: var(--title-display, var(--top-title-display));
}

::part(center),
[part~='center'] {
  --media-control-display: var(--controls, var(--center-controls));
  --media-play-button-display: var(--play-button, var(--center-play-button));
  --media-live-button-display: var(--live-button, var(--center-live-button));
  --media-seek-backward-button-display: var(--seek-backward-button, var(--center-seek-backward-button));
  --media-seek-forward-button-display: var(--seek-forward-button, var(--center-seek-forward-button));
  --media-mute-button-display: var(--mute-button, var(--center-mute-button));
  --media-captions-button-display: var(--captions-button, var(--center-captions-button));
  --media-captions-menu-button-display: var(
    --captions-menu-button,
    var(--media-captions-button-display, var(--center-captions-menu-button))
  );
  --media-rendition-menu-button-display: var(--rendition-menu-button, var(--center-rendition-menu-button));
  --media-audio-track-menu-button-display: var(--audio-track-menu-button, var(--center-audio-track-menu-button));
  --media-airplay-button-display: var(--airplay-button, var(--center-airplay-button));
  --media-pip-button-display: var(--pip-button, var(--center-pip-button));
  --media-fullscreen-button-display: var(--fullscreen-button, var(--center-fullscreen-button));
  --media-cast-button-display: var(--cast-button, var(--center-cast-button, var(--_cast-button-drm-display)));
  --media-playback-rate-button-display: var(--playback-rate-button, var(--center-playback-rate-button));
  --media-playback-rate-menu-button-display: var(
    --playback-rate-menu-button,
    var(--media-playback-rate-button-display, var(--center-playback-rate-menu-button))
  );
  --media-volume-range-display: var(--volume-range, var(--center-volume-range));
  --media-time-range-display: var(--time-range, var(--center-time-range));
  --media-time-display-display: var(--time-display, var(--center-time-display));
  --media-duration-display-display: var(--duration-display, var(--center-duration-display));
}

::part(bottom),
[part~='bottom'] {
  --media-control-display: var(--controls, var(--bottom-controls));
  --media-play-button-display: var(--play-button, var(--bottom-play-button));
  --media-live-button-display: var(--live-button, var(--bottom-live-button));
  --media-seek-backward-button-display: var(--seek-backward-button, var(--bottom-seek-backward-button));
  --media-seek-forward-button-display: var(--seek-forward-button, var(--bottom-seek-forward-button));
  --media-mute-button-display: var(--mute-button, var(--bottom-mute-button));
  --media-captions-button-display: var(--captions-button, var(--bottom-captions-button));
  --media-captions-menu-button-display: var(
    --captions-menu-button,
    var(--media-captions-button-display, var(--bottom-captions-menu-button))
  );
  --media-rendition-menu-button-display: var(--rendition-menu-button, var(--bottom-rendition-menu-button));
  --media-audio-track-menu-button-display: var(--audio-track-menu-button, var(--bottom-audio-track-menu-button));
  --media-airplay-button-display: var(--airplay-button, var(--bottom-airplay-button));
  --media-pip-button-display: var(--pip-button, var(--bottom-pip-button));
  --media-fullscreen-button-display: var(--fullscreen-button, var(--bottom-fullscreen-button));
  --media-cast-button-display: var(--cast-button, var(--bottom-cast-button, var(--_cast-button-drm-display)));
  --media-playback-rate-button-display: var(--playback-rate-button, var(--bottom-playback-rate-button));
  --media-playback-rate-menu-button-display: var(
    --playback-rate-menu-button,
    var(--media-playback-rate-button-display, var(--bottom-playback-rate-menu-button))
  );
  --media-volume-range-display: var(--volume-range, var(--bottom-volume-range));
  --media-time-range-display: var(--time-range, var(--bottom-time-range));
  --media-time-display-display: var(--time-display, var(--bottom-time-display));
  --media-duration-display-display: var(--duration-display, var(--bottom-duration-display));
  --media-title-display-display: var(--title-display, var(--bottom-title-display));
}

:host([no-tooltips]) {
  --media-tooltip-display: none;
}
`,hT=new WeakMap,hk=class e{constructor(e,t){this.element=e,this.type=t,this.element.addEventListener(this.type,this);let i=hT.get(this.element);i&&i.set(this.type,this)}set(e){if("function"==typeof e)this.handleEvent=e.bind(this.element);else if("object"==typeof e&&"function"==typeof e.handleEvent)this.handleEvent=e.handleEvent.bind(e);else{this.element.removeEventListener(this.type,this);let e=hT.get(this.element);e&&e.delete(this.type)}}static for(t){hT.has(t.element)||hT.set(t.element,new Map);let i=t.attributeName.slice(2),a=hT.get(t.element);return a&&a.has(i)?a.get(i):new e(t.element,i)}},h_=new Map,hw=new WeakMap,hI=new WeakMap,hR=class{constructor(e,t,i){this.strings=e,this.values=t,this.processor=i,this.stringsKey=this.strings.join("\x01")}get template(){if(h_.has(this.stringsKey))return h_.get(this.stringsKey);{let e=m8.createElement("template"),t=this.strings.length-1;return e.innerHTML=this.strings.reduce((e,i,a)=>e+i+(a<t?`{{ ${a} }}`:""),""),h_.set(this.stringsKey,e),e}}renderInto(e){var t;let i=this.template;if(hw.get(e)!==i){hw.set(e,i);let t=new ss(i,this.values,this.processor);hI.set(e,t),e instanceof sp?e.replace(...t.children):e.appendChild(t);return}let a=hI.get(e);null==(t=null==a?void 0:a.update)||t.call(a,this.values)}},hC={processCallback(e,t,i){var a;if(i)for(let[e,r]of t)e in i&&function(e,t){(function(e,t){if(e instanceof sc&&t instanceof Element){let i=e.element;return i[e.attributeName]!==t&&(e.element.removeAttributeNS(e.attributeNamespace,e.attributeName),i[e.attributeName]=t),!0}return!1})(e,t)||function(e,t){if("boolean"==typeof t&&e instanceof sc){let i=e.attributeNamespace;return t!==e.element.hasAttributeNS(i,e.attributeName)&&(e.booleanValue=t),!0}return!1}(e,t)||e instanceof sc&&e.attributeName.startsWith("on")&&(hk.for(e).set(t),e.element.removeAttributeNS(e.attributeNamespace,e.attributeName),1)||!1===t&&e instanceof sp&&(e.replace(""),1)||t instanceof hR&&e instanceof sp&&(t.renderInto(e),1)||t instanceof DocumentFragment&&e instanceof sp&&(t.childNodes.length&&e.replace(...t.childNodes),1)||function(e,t){if(e instanceof sc){let i=e.attributeNamespace,a=e.element.getAttributeNS(i,e.attributeName);return String(t)!==a&&(e.value=String(t))}e.value=String(t)}(e,t)}(r,null!=(a=i[e])?a:"")}};function hS(e,...t){return new hR(e,t,hC)}var hM=Object.values({TOP:"top",CENTER:"center",BOTTOM:"bottom",LAYER:"layer",MEDIA_LAYER:"media-layer",POSTER_LAYER:"poster-layer",VERTICAL_LAYER:"vertical-layer",CENTERED_LAYER:"centered-layer",GESTURE_LAYER:"gesture-layer",CONTROLLER_LAYER:"controller",BUTTON:"button",RANGE:"range",THUMB:"thumb",DISPLAY:"display",CONTROL_BAR:"control-bar",MENU_BUTTON:"menu-button",MENU:"menu",MENU_ITEM:"menu-item",OPTION:"option",POSTER:"poster",LIVE:"live",PLAY:"play",PRE_PLAY:"pre-play",SEEK_BACKWARD:"seek-backward",SEEK_FORWARD:"seek-forward",MUTE:"mute",CAPTIONS:"captions",AIRPLAY:"airplay",PIP:"pip",FULLSCREEN:"fullscreen",CAST:"cast",PLAYBACK_RATE:"playback-rate",VOLUME:"volume",TIME:"time",TITLE:"title",AUDIO_TRACK:"audio-track",RENDITION:"rendition"}).join(", "),hL=e=>e.charAt(0).toUpperCase()+e.slice(1),hD=(e,t)=>{let i=(e=>{if(e.muxCode){if(e.muxCode===s.NETWORK_TOKEN_EXPIRED)return"403-expired-token.md";if(e.muxCode===s.NETWORK_TOKEN_MALFORMED)return"403-malformatted-token.md";if([s.NETWORK_TOKEN_AUD_MISMATCH,s.NETWORK_TOKEN_AUD_MISSING].includes(e.muxCode))return"403-incorrect-aud-value.md";if(e.muxCode===s.NETWORK_TOKEN_SUB_MISMATCH)return"403-playback-id-mismatch.md";if(e.muxCode===s.NETWORK_TOKEN_MISSING)return"missing-signed-tokens.md";if(e.muxCode===s.NETWORK_NOT_FOUND)return"404-not-found.md";if(e.muxCode===s.NETWORK_NOT_READY)return"412-not-playable.md"}if(e.code){if(e.code===l.MEDIA_ERR_NETWORK)return"";if(e.code===l.MEDIA_ERR_DECODE)return"media-decode-error.md";if(e.code===l.MEDIA_ERR_SRC_NOT_SUPPORTED)return"media-src-not-supported.md"}return""})(e);return{message:e.message,context:e.context,file:i}},hx=`<template id="media-theme-gerwig">
  <style>
    @keyframes pre-play-hide {
      0% {
        transform: scale(1);
        opacity: 1;
      }

      30% {
        transform: scale(0.7);
      }

      100% {
        transform: scale(1.5);
        opacity: 0;
      }
    }

    :host {
      --_primary-color: var(--media-primary-color, #fff);
      --_secondary-color: var(--media-secondary-color, transparent);
      --_accent-color: var(--media-accent-color, #fa50b5);
      --_text-color: var(--media-text-color, #000);

      --media-icon-color: var(--_primary-color);
      --media-control-background: var(--_secondary-color);
      --media-control-hover-background: var(--_accent-color);
      --media-time-buffered-color: rgba(255, 255, 255, 0.4);
      --media-preview-time-text-shadow: none;
      --media-control-height: 14px;
      --media-control-padding: 6px;
      --media-tooltip-container-margin: 6px;
      --media-tooltip-distance: 18px;

      color: var(--_primary-color);
      display: inline-block;
      width: 100%;
      height: 100%;
    }

    :host([audio]) {
      --_secondary-color: var(--media-secondary-color, black);
      --media-preview-time-text-shadow: none;
    }

    :host([audio]) ::slotted([slot='media']) {
      height: 0px;
    }

    :host([audio]) media-loading-indicator {
      display: none;
    }

    :host([audio]) media-controller {
      background: transparent;
    }

    :host([audio]) media-controller::part(vertical-layer) {
      background: transparent;
    }

    :host([audio]) media-control-bar {
      width: 100%;
      background-color: var(--media-control-background);
    }

    /*
     * 0.433s is the transition duration for VTT Regions.
     * Borrowed here, so the captions don't move too fast.
     */
    media-controller {
      --media-webkit-text-track-transform: translateY(0) scale(0.98);
      --media-webkit-text-track-transition: transform 0.433s ease-out 0.3s;
    }
    media-controller:is([mediapaused], :not([userinactive])) {
      --media-webkit-text-track-transform: translateY(-50px) scale(0.98);
      --media-webkit-text-track-transition: transform 0.15s ease;
    }

    /*
     * CSS specific to iOS devices.
     * See: https://stackoverflow.com/questions/30102792/css-media-query-to-target-only-ios-devices/60220757#60220757
     */
    @supports (-webkit-touch-callout: none) {
      /* Disable subtitle adjusting for iOS Safari */
      media-controller[mediaisfullscreen] {
        --media-webkit-text-track-transform: unset;
        --media-webkit-text-track-transition: unset;
      }
    }

    media-time-range {
      --media-box-padding-left: 6px;
      --media-box-padding-right: 6px;
      --media-range-bar-color: var(--_accent-color);
      --media-time-range-buffered-color: var(--_primary-color);
      --media-range-track-color: transparent;
      --media-range-track-background: rgba(255, 255, 255, 0.4);
      --media-range-thumb-background: radial-gradient(
        circle,
        #000 0%,
        #000 25%,
        var(--_accent-color) 25%,
        var(--_accent-color)
      );
      --media-range-thumb-width: 12px;
      --media-range-thumb-height: 12px;
      --media-range-thumb-transform: scale(0);
      --media-range-thumb-transition: transform 0.3s;
      --media-range-thumb-opacity: 1;
      --media-preview-background: var(--_primary-color);
      --media-box-arrow-background: var(--_primary-color);
      --media-preview-thumbnail-border: 5px solid var(--_primary-color);
      --media-preview-border-radius: 5px;
      --media-text-color: var(--_text-color);
      --media-control-hover-background: transparent;
      --media-preview-chapter-text-shadow: none;
      color: var(--_accent-color);
      padding: 0 6px;
    }

    :host([audio]) media-time-range {
      --media-preview-time-padding: 1.5px 6px;
      --media-preview-box-margin: 0 0 -5px;
    }

    media-time-range:hover {
      --media-range-thumb-transform: scale(1);
    }

    media-preview-thumbnail {
      border-bottom-width: 0;
    }

    [part~='menu'] {
      border-radius: 2px;
      border: 1px solid rgba(0, 0, 0, 0.1);
      bottom: 50px;
      padding: 2.5px 10px;
    }

    [part~='menu']::part(indicator) {
      fill: var(--_accent-color);
    }

    [part~='menu']::part(menu-item) {
      box-sizing: border-box;
      display: flex;
      align-items: center;
      padding: 6px 10px;
      min-height: 34px;
    }

    [part~='menu']::part(checked) {
      font-weight: 700;
    }

    media-captions-menu,
    media-rendition-menu,
    media-audio-track-menu,
    media-playback-rate-menu {
      position: absolute; /* ensure they don't take up space in DOM on load */
      --media-menu-background: var(--_primary-color);
      --media-menu-item-checked-background: transparent;
      --media-text-color: var(--_text-color);
      --media-menu-item-hover-background: transparent;
      --media-menu-item-hover-outline: var(--_accent-color) solid 1px;
    }

    media-rendition-menu {
      min-width: 140px;
    }

    /* The icon is a circle so make it 16px high instead of 14px for more balance. */
    media-audio-track-menu-button {
      --media-control-padding: 5px;
      --media-control-height: 16px;
    }

    media-playback-rate-menu-button {
      --media-control-padding: 6px 3px;
      min-width: 4.4ch;
    }

    media-playback-rate-menu {
      --media-menu-flex-direction: row;
      --media-menu-item-checked-background: var(--_accent-color);
      --media-menu-item-checked-indicator-display: none;
      margin-right: 6px;
      padding: 0;
      --media-menu-gap: 0.25em;
    }

    media-playback-rate-menu[part~='menu']::part(menu-item) {
      padding: 6px 6px 6px 8px;
    }

    media-playback-rate-menu[part~='menu']::part(checked) {
      color: #fff;
    }

    :host(:not([audio])) media-time-range {
      /* Adding px is required here for calc() */
      --media-range-padding: 0px;
      background: transparent;
      z-index: 10;
      height: 10px;
      bottom: -3px;
      width: 100%;
    }

    media-control-bar :is([role='button'], [role='switch'], button) {
      line-height: 0;
    }

    media-control-bar :is([part*='button'], [part*='range'], [part*='display']) {
      border-radius: 3px;
    }

    .spacer {
      flex-grow: 1;
      background-color: var(--media-control-background, rgba(20, 20, 30, 0.7));
    }

    media-control-bar[slot~='top-chrome'] {
      min-height: 42px;
      pointer-events: none;
    }

    media-control-bar {
      --gradient-steps:
        hsl(0 0% 0% / 0) 0%, hsl(0 0% 0% / 0.013) 8.1%, hsl(0 0% 0% / 0.049) 15.5%, hsl(0 0% 0% / 0.104) 22.5%,
        hsl(0 0% 0% / 0.175) 29%, hsl(0 0% 0% / 0.259) 35.3%, hsl(0 0% 0% / 0.352) 41.2%, hsl(0 0% 0% / 0.45) 47.1%,
        hsl(0 0% 0% / 0.55) 52.9%, hsl(0 0% 0% / 0.648) 58.8%, hsl(0 0% 0% / 0.741) 64.7%, hsl(0 0% 0% / 0.825) 71%,
        hsl(0 0% 0% / 0.896) 77.5%, hsl(0 0% 0% / 0.951) 84.5%, hsl(0 0% 0% / 0.987) 91.9%, hsl(0 0% 0%) 100%;
    }

    :host([title]) media-control-bar[slot='top-chrome']::before,
    :host([videotitle]) media-control-bar[slot='top-chrome']::before {
      content: '';
      position: absolute;
      width: 100%;
      padding-bottom: min(100px, 25%);
      background: linear-gradient(to top, var(--gradient-steps));
      opacity: 0.8;
      pointer-events: none;
    }

    :host(:not([audio])) media-control-bar[part~='bottom']::before {
      content: '';
      position: absolute;
      width: 100%;
      bottom: 0;
      left: 0;
      padding-bottom: min(100px, 25%);
      background: linear-gradient(to bottom, var(--gradient-steps));
      opacity: 0.8;
      z-index: 1;
      pointer-events: none;
    }

    media-control-bar[part~='bottom'] > * {
      z-index: 20;
    }

    media-control-bar[part~='bottom'] {
      padding: 6px 6px;
    }

    media-control-bar[slot~='top-chrome'] > * {
      --media-control-background: transparent;
      --media-control-hover-background: transparent;
      position: relative;
    }

    media-controller::part(vertical-layer) {
      transition: background-color 1s;
    }

    media-controller:is([mediapaused], :not([userinactive]))::part(vertical-layer) {
      background-color: var(--controls-backdrop-color, var(--controls, transparent));
      transition: background-color 0.25s;
    }

    .center-controls {
      --media-button-icon-width: 100%;
      --media-button-icon-height: auto;
      --media-tooltip-display: none;
      pointer-events: none;
      width: 100%;
      display: flex;
      flex-flow: row;
      align-items: center;
      justify-content: center;
      paint-order: stroke;
      stroke: rgba(102, 102, 102, 1);
      stroke-width: 0.3px;
      text-shadow:
        0 0 2px rgb(0 0 0 / 0.25),
        0 0 6px rgb(0 0 0 / 0.25);
    }

    .center-controls media-play-button {
      --media-control-background: transparent;
      --media-control-hover-background: transparent;
      --media-control-padding: 0;
      width: 40px;
      filter: drop-shadow(0 0 2px rgb(0 0 0 / 0.25)) drop-shadow(0 0 6px rgb(0 0 0 / 0.25));
    }

    [breakpointsm] .center-controls media-play-button {
      width: 90px;
      height: 90px;
      border-radius: 50%;
      transition: background 0.4s;
      padding: 24px;
      --media-control-background: #000;
      --media-control-hover-background: var(--_accent-color);
    }

    .center-controls media-seek-backward-button,
    .center-controls media-seek-forward-button {
      --media-control-background: transparent;
      --media-control-hover-background: transparent;
      padding: 0;
      margin: 0 20px;
      width: max(33px, min(8%, 40px));
      text-shadow:
        0 0 2px rgb(0 0 0 / 0.25),
        0 0 6px rgb(0 0 0 / 0.25);
    }

    [breakpointsm]:not([audio]) .center-controls.pre-playback {
      display: grid;
      align-items: initial;
      justify-content: initial;
      height: 100%;
      overflow: hidden;
    }

    [breakpointsm]:not([audio]) .center-controls.pre-playback media-play-button {
      place-self: var(--_pre-playback-place, center);
      grid-area: 1 / 1;
      margin: 16px;
    }

    /* Show and hide controls or pre-playback state */

    [breakpointsm]:is([mediahasplayed], :not([mediapaused])):not([audio])
      .center-controls.pre-playback
      media-play-button {
      /* Using \`forwards\` would lead to a laggy UI after the animation got in the end state */
      animation: 0.3s linear pre-play-hide;
      opacity: 0;
      pointer-events: none;
    }

    .autoplay-unmute {
      --media-control-hover-background: transparent;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      filter: drop-shadow(0 0 2px rgb(0 0 0 / 0.25)) drop-shadow(0 0 6px rgb(0 0 0 / 0.25));
    }

    .autoplay-unmute-btn {
      --media-control-height: 16px;
      border-radius: 8px;
      background: #000;
      color: var(--_primary-color);
      display: flex;
      align-items: center;
      padding: 8px 16px;
      font-size: 18px;
      font-weight: 500;
      cursor: pointer;
    }

    .autoplay-unmute-btn:hover {
      background: var(--_accent-color);
    }

    [breakpointsm] .autoplay-unmute-btn {
      --media-control-height: 30px;
      padding: 14px 24px;
      font-size: 26px;
    }

    .autoplay-unmute-btn svg {
      margin: 0 6px 0 0;
    }

    [breakpointsm] .autoplay-unmute-btn svg {
      margin: 0 10px 0 0;
    }

    media-controller:not([audio]):not([mediahasplayed]) *:is(media-control-bar, media-time-range) {
      display: none;
    }

    media-error-dialog:not([mediaerrorcode]) {
      opacity: 0;
    }

    media-loading-indicator {
      --media-loading-icon-width: 100%;
      --media-button-icon-height: auto;
      display: var(--media-control-display, var(--media-loading-indicator-display, flex));
      pointer-events: none;
      position: absolute;
      width: min(15%, 150px);
      flex-flow: row;
      align-items: center;
      justify-content: center;
    }

    /* Intentionally don't target the div for transition but the children
     of the div. Prevents messing with media-chrome's autohide feature. */
    media-loading-indicator + div * {
      transition: opacity 0.15s;
      opacity: 1;
    }

    media-loading-indicator[medialoading]:not([mediapaused]) ~ div > * {
      opacity: 0;
      transition-delay: 400ms;
    }

    media-volume-range {
      width: min(100%, 100px);
      --media-range-padding-left: 10px;
      --media-range-padding-right: 10px;
      --media-range-thumb-width: 12px;
      --media-range-thumb-height: 12px;
      --media-range-thumb-background: radial-gradient(
        circle,
        #000 0%,
        #000 25%,
        var(--_primary-color) 25%,
        var(--_primary-color)
      );
      --media-control-hover-background: none;
    }

    media-time-display {
      white-space: nowrap;
    }

    /* Generic style for explicitly disabled controls */
    media-control-bar[part~='bottom'] [disabled],
    media-control-bar[part~='bottom'] [aria-disabled='true'] {
      opacity: 60%;
      cursor: not-allowed;
    }

    media-text-display {
      --media-font-size: 16px;
      --media-control-padding: 14px;
      font-weight: 500;
    }

    media-play-button.animated *:is(g, path) {
      transition: all 0.3s;
    }

    media-play-button.animated[mediapaused] .pause-icon-pt1 {
      opacity: 0;
    }

    media-play-button.animated[mediapaused] .pause-icon-pt2 {
      transform-origin: center center;
      transform: scaleY(0);
    }

    media-play-button.animated[mediapaused] .play-icon {
      clip-path: inset(0 0 0 0);
    }

    media-play-button.animated:not([mediapaused]) .play-icon {
      clip-path: inset(0 0 0 100%);
    }

    media-seek-forward-button,
    media-seek-backward-button {
      --media-font-weight: 400;
    }

    .mute-icon {
      display: inline-block;
    }

    .mute-icon :is(path, g) {
      transition: opacity 0.5s;
    }

    .muted {
      opacity: 0;
    }

    media-mute-button[mediavolumelevel='low'] :is(.volume-medium, .volume-high),
    media-mute-button[mediavolumelevel='medium'] :is(.volume-high) {
      opacity: 0;
    }

    media-mute-button[mediavolumelevel='off'] .unmuted {
      opacity: 0;
    }

    media-mute-button[mediavolumelevel='off'] .muted {
      opacity: 1;
    }

    /**
     * Our defaults for these buttons are to hide them at small sizes
     * users can override this with CSS
     */
    media-controller:not([breakpointsm]):not([audio]) {
      --bottom-play-button: none;
      --bottom-seek-backward-button: none;
      --bottom-seek-forward-button: none;
      --bottom-time-display: none;
      --bottom-playback-rate-menu-button: none;
      --bottom-pip-button: none;
    }

    [part='mux-badge'] {
      position: absolute;
      bottom: 10px;
      right: 10px;
      z-index: 2;
      opacity: 0.6;
      transition:
        opacity 0.2s ease-in-out,
        bottom 0.2s ease-in-out;
    }

    [part='mux-badge']:hover {
      opacity: 1;
    }

    [part='mux-badge'] a {
      font-size: 14px;
      font-family: var(--_font-family);
      color: var(--_primary-color);
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 5px;
    }

    [part='mux-badge'] .mux-badge-text {
      transition: opacity 0.5s ease-in-out;
      opacity: 0;
    }

    [part='mux-badge'] .mux-badge-logo {
      width: 40px;
      height: auto;
      display: inline-block;
    }

    [part='mux-badge'] .mux-badge-logo svg {
      width: 100%;
      height: 100%;
      fill: white;
    }

    media-controller:not([userinactive]):not([mediahasplayed]) [part='mux-badge'],
    media-controller:not([userinactive]) [part='mux-badge'],
    media-controller[mediahasplayed][mediapaused] [part='mux-badge'] {
      transition: bottom 0.1s ease-in-out;
    }

    media-controller[userinactive]:not([mediapaused]) [part='mux-badge'] {
      transition: bottom 0.2s ease-in-out 0.62s;
    }

    media-controller:not([userinactive]) [part='mux-badge'] .mux-badge-text,
    media-controller[mediahasplayed][mediapaused] [part='mux-badge'] .mux-badge-text {
      opacity: 1;
    }

    media-controller[userinactive]:not([mediapaused]) [part='mux-badge'] .mux-badge-text {
      opacity: 0;
    }

    media-controller[userinactive]:not([mediapaused]) [part='mux-badge'] {
      bottom: 10px;
    }

    media-controller:not([userinactive]):not([mediahasplayed]) [part='mux-badge'] {
      bottom: 10px;
    }

    media-controller:not([userinactive])[mediahasplayed] [part='mux-badge'],
    media-controller[mediahasplayed][mediapaused] [part='mux-badge'] {
      bottom: calc(28px + var(--media-control-height, 0px) + var(--media-control-padding, 0px) * 2);
    }
  </style>

  <template partial="TitleDisplay">
    <template if="videotitle">
      <template if="videotitle != true">
        <media-text-display part="top title display" class="title-display">{{videotitle}}</media-text-display>
      </template>
    </template>
    <template if="!videotitle">
      <template if="title">
        <media-text-display part="top title display" class="title-display">{{title}}</media-text-display>
      </template>
    </template>
  </template>

  <template partial="PlayButton">
    <media-play-button
      part="{{section ?? 'bottom'}} play button"
      disabled="{{disabled}}"
      aria-disabled="{{disabled}}"
      class="animated"
    >
      <svg aria-hidden="true" viewBox="0 0 18 14" slot="icon">
        <g class="play-icon">
          <path
            d="M15.5987 6.2911L3.45577 0.110898C2.83667 -0.204202 2.06287 0.189698 2.06287 0.819798V13.1802C2.06287 13.8103 2.83667 14.2042 3.45577 13.8891L15.5987 7.7089C16.2178 7.3938 16.2178 6.6061 15.5987 6.2911Z"
          />
        </g>
        <g class="pause-icon">
          <path
            class="pause-icon-pt1"
            d="M5.90709 0H2.96889C2.46857 0 2.06299 0.405585 2.06299 0.9059V13.0941C2.06299 13.5944 2.46857 14 2.96889 14H5.90709C6.4074 14 6.81299 13.5944 6.81299 13.0941V0.9059C6.81299 0.405585 6.4074 0 5.90709 0Z"
          />
          <path
            class="pause-icon-pt2"
            d="M15.1571 0H12.2189C11.7186 0 11.313 0.405585 11.313 0.9059V13.0941C11.313 13.5944 11.7186 14 12.2189 14H15.1571C15.6574 14 16.063 13.5944 16.063 13.0941V0.9059C16.063 0.405585 15.6574 0 15.1571 0Z"
          />
        </g>
      </svg>
    </media-play-button>
  </template>

  <template partial="PrePlayButton">
    <media-play-button
      part="{{section ?? 'center'}} play button pre-play"
      disabled="{{disabled}}"
      aria-disabled="{{disabled}}"
    >
      <svg aria-hidden="true" viewBox="0 0 18 14" slot="icon" style="transform: translate(3px, 0)">
        <path
          d="M15.5987 6.2911L3.45577 0.110898C2.83667 -0.204202 2.06287 0.189698 2.06287 0.819798V13.1802C2.06287 13.8103 2.83667 14.2042 3.45577 13.8891L15.5987 7.7089C16.2178 7.3938 16.2178 6.6061 15.5987 6.2911Z"
        />
      </svg>
    </media-play-button>
  </template>

  <template partial="SeekBackwardButton">
    <media-seek-backward-button
      seekoffset="{{backwardseekoffset}}"
      part="{{section ?? 'bottom'}} seek-backward button"
      disabled="{{disabled}}"
      aria-disabled="{{disabled}}"
    >
      <svg viewBox="0 0 22 14" aria-hidden="true" slot="icon">
        <path
          d="M3.65 2.07888L0.0864 6.7279C-0.0288 6.87812 -0.0288 7.12188 0.0864 7.2721L3.65 11.9211C3.7792 12.0896 4 11.9703 4 11.7321V2.26787C4 2.02968 3.7792 1.9104 3.65 2.07888Z"
        />
        <text transform="translate(6 12)" style="font-size: 14px; font-family: 'ArialMT', 'Arial'">
          {{backwardseekoffset}}
        </text>
      </svg>
    </media-seek-backward-button>
  </template>

  <template partial="SeekForwardButton">
    <media-seek-forward-button
      seekoffset="{{forwardseekoffset}}"
      part="{{section ?? 'bottom'}} seek-forward button"
      disabled="{{disabled}}"
      aria-disabled="{{disabled}}"
    >
      <svg viewBox="0 0 22 14" aria-hidden="true" slot="icon">
        <g>
          <text transform="translate(-1 12)" style="font-size: 14px; font-family: 'ArialMT', 'Arial'">
            {{forwardseekoffset}}
          </text>
          <path
            d="M18.35 11.9211L21.9136 7.2721C22.0288 7.12188 22.0288 6.87812 21.9136 6.7279L18.35 2.07888C18.2208 1.91041 18 2.02968 18 2.26787V11.7321C18 11.9703 18.2208 12.0896 18.35 11.9211Z"
          />
        </g>
      </svg>
    </media-seek-forward-button>
  </template>

  <template partial="MuteButton">
    <media-mute-button part="bottom mute button" disabled="{{disabled}}" aria-disabled="{{disabled}}">
      <svg viewBox="0 0 18 14" slot="icon" class="mute-icon" aria-hidden="true">
        <g class="unmuted">
          <path
            d="M6.76786 1.21233L3.98606 3.98924H1.19937C0.593146 3.98924 0.101743 4.51375 0.101743 5.1607V6.96412L0 6.99998L0.101743 7.03583V8.83926C0.101743 9.48633 0.593146 10.0108 1.19937 10.0108H3.98606L6.76773 12.7877C7.23561 13.2547 8 12.9007 8 12.2171V1.78301C8 1.09925 7.23574 0.745258 6.76786 1.21233Z"
          />
          <path
            class="volume-low"
            d="M10 3.54781C10.7452 4.55141 11.1393 5.74511 11.1393 6.99991C11.1393 8.25471 10.7453 9.44791 10 10.4515L10.7988 11.0496C11.6734 9.87201 12.1356 8.47161 12.1356 6.99991C12.1356 5.52821 11.6735 4.12731 10.7988 2.94971L10 3.54781Z"
          />
          <path
            class="volume-medium"
            d="M12.3778 2.40086C13.2709 3.76756 13.7428 5.35806 13.7428 7.00026C13.7428 8.64246 13.2709 10.233 12.3778 11.5992L13.2106 12.1484C14.2107 10.6185 14.739 8.83796 14.739 7.00016C14.739 5.16236 14.2107 3.38236 13.2106 1.85156L12.3778 2.40086Z"
          />
          <path
            class="volume-high"
            d="M15.5981 0.75L14.7478 1.2719C15.7937 2.9919 16.3468 4.9723 16.3468 7C16.3468 9.0277 15.7937 11.0082 14.7478 12.7281L15.5981 13.25C16.7398 11.3722 17.343 9.211 17.343 7C17.343 4.789 16.7398 2.6268 15.5981 0.75Z"
          />
        </g>
        <g class="muted">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M4.39976 4.98924H1.19937C1.19429 4.98924 1.17777 4.98961 1.15296 5.01609C1.1271 5.04369 1.10174 5.09245 1.10174 5.1607V8.83926C1.10174 8.90761 1.12714 8.95641 1.15299 8.984C1.17779 9.01047 1.1943 9.01084 1.19937 9.01084H4.39977L7 11.6066V2.39357L4.39976 4.98924ZM7.47434 1.92006C7.4743 1.9201 7.47439 1.92002 7.47434 1.92006V1.92006ZM6.76773 12.7877L3.98606 10.0108H1.19937C0.593146 10.0108 0.101743 9.48633 0.101743 8.83926V7.03583L0 6.99998L0.101743 6.96412V5.1607C0.101743 4.51375 0.593146 3.98924 1.19937 3.98924H3.98606L6.76786 1.21233C7.23574 0.745258 8 1.09925 8 1.78301V12.2171C8 12.9007 7.23561 13.2547 6.76773 12.7877Z"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M15.2677 9.30323C15.463 9.49849 15.7796 9.49849 15.9749 9.30323C16.1701 9.10796 16.1701 8.79138 15.9749 8.59612L14.2071 6.82841L15.9749 5.06066C16.1702 4.8654 16.1702 4.54882 15.9749 4.35355C15.7796 4.15829 15.4631 4.15829 15.2678 4.35355L13.5 6.1213L11.7322 4.35348C11.537 4.15822 11.2204 4.15822 11.0251 4.35348C10.8298 4.54874 10.8298 4.86532 11.0251 5.06058L12.7929 6.82841L11.0251 8.59619C10.8299 8.79146 10.8299 9.10804 11.0251 9.3033C11.2204 9.49856 11.537 9.49856 11.7323 9.3033L13.5 7.53552L15.2677 9.30323Z"
          />
        </g>
      </svg>
    </media-mute-button>
  </template>

  <template partial="PipButton">
    <media-pip-button part="bottom pip button" disabled="{{disabled}}" aria-disabled="{{disabled}}">
      <svg viewBox="0 0 18 14" aria-hidden="true" slot="icon">
        <path
          d="M15.9891 0H2.011C0.9004 0 0 0.9003 0 2.0109V11.989C0 13.0996 0.9004 14 2.011 14H15.9891C17.0997 14 18 13.0997 18 11.9891V2.0109C18 0.9003 17.0997 0 15.9891 0ZM17 11.9891C17 12.5465 16.5465 13 15.9891 13H2.011C1.4536 13 1.0001 12.5465 1.0001 11.9891V2.0109C1.0001 1.4535 1.4536 0.9999 2.011 0.9999H15.9891C16.5465 0.9999 17 1.4535 17 2.0109V11.9891Z"
        />
        <path
          d="M15.356 5.67822H8.19523C8.03253 5.67822 7.90063 5.81012 7.90063 5.97282V11.3836C7.90063 11.5463 8.03253 11.6782 8.19523 11.6782H15.356C15.5187 11.6782 15.6506 11.5463 15.6506 11.3836V5.97282C15.6506 5.81012 15.5187 5.67822 15.356 5.67822Z"
        />
      </svg>
    </media-pip-button>
  </template>

  <template partial="CaptionsMenu">
    <media-captions-menu-button part="bottom captions button">
      <svg aria-hidden="true" viewBox="0 0 18 14" slot="on">
        <path
          d="M15.989 0H2.011C0.9004 0 0 0.9003 0 2.0109V11.9891C0 13.0997 0.9004 14 2.011 14H15.989C17.0997 14 18 13.0997 18 11.9891V2.0109C18 0.9003 17.0997 0 15.989 0ZM4.2292 8.7639C4.5954 9.1902 5.0935 9.4031 5.7233 9.4031C6.1852 9.4031 6.5544 9.301 6.8302 9.0969C7.1061 8.8933 7.2863 8.614 7.3702 8.26H8.4322C8.3062 8.884 8.0093 9.3733 7.5411 9.7273C7.0733 10.0813 6.4703 10.2581 5.732 10.2581C5.108 10.2581 4.5699 10.1219 4.1168 9.8489C3.6637 9.5759 3.3141 9.1946 3.0685 8.7058C2.8224 8.2165 2.6994 7.6511 2.6994 7.009C2.6994 6.3611 2.8224 5.7927 3.0685 5.3034C3.3141 4.8146 3.6637 4.4323 4.1168 4.1559C4.5699 3.88 5.108 3.7418 5.732 3.7418C6.4703 3.7418 7.0733 3.922 7.5411 4.2818C8.0094 4.6422 8.3062 5.1461 8.4322 5.794H7.3702C7.2862 5.4283 7.106 5.1368 6.8302 4.921C6.5544 4.7052 6.1852 4.5968 5.7233 4.5968C5.0934 4.5968 4.5954 4.8116 4.2292 5.2404C3.8635 5.6696 3.6804 6.259 3.6804 7.009C3.6804 7.7531 3.8635 8.3381 4.2292 8.7639ZM11.0974 8.7639C11.4636 9.1902 11.9617 9.4031 12.5915 9.4031C13.0534 9.4031 13.4226 9.301 13.6984 9.0969C13.9743 8.8933 14.1545 8.614 14.2384 8.26H15.3004C15.1744 8.884 14.8775 9.3733 14.4093 9.7273C13.9415 10.0813 13.3385 10.2581 12.6002 10.2581C11.9762 10.2581 11.4381 10.1219 10.985 9.8489C10.5319 9.5759 10.1823 9.1946 9.9367 8.7058C9.6906 8.2165 9.5676 7.6511 9.5676 7.009C9.5676 6.3611 9.6906 5.7927 9.9367 5.3034C10.1823 4.8146 10.5319 4.4323 10.985 4.1559C11.4381 3.88 11.9762 3.7418 12.6002 3.7418C13.3385 3.7418 13.9415 3.922 14.4093 4.2818C14.8776 4.6422 15.1744 5.1461 15.3004 5.794H14.2384C14.1544 5.4283 13.9742 5.1368 13.6984 4.921C13.4226 4.7052 13.0534 4.5968 12.5915 4.5968C11.9616 4.5968 11.4636 4.8116 11.0974 5.2404C10.7317 5.6696 10.5486 6.259 10.5486 7.009C10.5486 7.7531 10.7317 8.3381 11.0974 8.7639Z"
        />
      </svg>
      <svg aria-hidden="true" viewBox="0 0 18 14" slot="off">
        <path
          d="M5.73219 10.258C5.10819 10.258 4.57009 10.1218 4.11699 9.8488C3.66389 9.5758 3.31429 9.1945 3.06869 8.7057C2.82259 8.2164 2.69958 7.651 2.69958 7.0089C2.69958 6.361 2.82259 5.7926 3.06869 5.3033C3.31429 4.8145 3.66389 4.4322 4.11699 4.1558C4.57009 3.8799 5.10819 3.7417 5.73219 3.7417C6.47049 3.7417 7.07348 3.9219 7.54128 4.2817C8.00958 4.6421 8.30638 5.146 8.43238 5.7939H7.37039C7.28639 5.4282 7.10618 5.1367 6.83039 4.9209C6.55459 4.7051 6.18538 4.5967 5.72348 4.5967C5.09358 4.5967 4.59559 4.8115 4.22939 5.2403C3.86369 5.6695 3.68058 6.2589 3.68058 7.0089C3.68058 7.753 3.86369 8.338 4.22939 8.7638C4.59559 9.1901 5.09368 9.403 5.72348 9.403C6.18538 9.403 6.55459 9.3009 6.83039 9.0968C7.10629 8.8932 7.28649 8.6139 7.37039 8.2599H8.43238C8.30638 8.8839 8.00948 9.3732 7.54128 9.7272C7.07348 10.0812 6.47049 10.258 5.73219 10.258Z"
        />
        <path
          d="M12.6003 10.258C11.9763 10.258 11.4382 10.1218 10.9851 9.8488C10.532 9.5758 10.1824 9.1945 9.93685 8.7057C9.69075 8.2164 9.56775 7.651 9.56775 7.0089C9.56775 6.361 9.69075 5.7926 9.93685 5.3033C10.1824 4.8145 10.532 4.4322 10.9851 4.1558C11.4382 3.8799 11.9763 3.7417 12.6003 3.7417C13.3386 3.7417 13.9416 3.9219 14.4094 4.2817C14.8777 4.6421 15.1745 5.146 15.3005 5.7939H14.2385C14.1545 5.4282 13.9743 5.1367 13.6985 4.9209C13.4227 4.7051 13.0535 4.5967 12.5916 4.5967C11.9617 4.5967 11.4637 4.8115 11.0975 5.2403C10.7318 5.6695 10.5487 6.2589 10.5487 7.0089C10.5487 7.753 10.7318 8.338 11.0975 8.7638C11.4637 9.1901 11.9618 9.403 12.5916 9.403C13.0535 9.403 13.4227 9.3009 13.6985 9.0968C13.9744 8.8932 14.1546 8.6139 14.2385 8.2599H15.3005C15.1745 8.8839 14.8776 9.3732 14.4094 9.7272C13.9416 10.0812 13.3386 10.258 12.6003 10.258Z"
        />
        <path
          d="M15.9891 1C16.5465 1 17 1.4535 17 2.011V11.9891C17 12.5465 16.5465 13 15.9891 13H2.0109C1.4535 13 1 12.5465 1 11.9891V2.0109C1 1.4535 1.4535 0.9999 2.0109 0.9999L15.9891 1ZM15.9891 0H2.0109C0.9003 0 0 0.9003 0 2.0109V11.9891C0 13.0997 0.9003 14 2.0109 14H15.9891C17.0997 14 18 13.0997 18 11.9891V2.0109C18 0.9003 17.0997 0 15.9891 0Z"
        />
      </svg>
    </media-captions-menu-button>
    <media-captions-menu
      hidden
      anchor="auto"
      part="bottom captions menu"
      disabled="{{disabled}}"
      aria-disabled="{{disabled}}"
      exportparts="menu-item"
    >
      <div slot="checked-indicator">
        <style>
          .indicator {
            position: relative;
            top: 1px;
            width: 0.9em;
            height: auto;
            fill: var(--_accent-color);
            margin-right: 5px;
          }

          [aria-checked='false'] .indicator {
            display: none;
          }
        </style>
        <svg viewBox="0 0 14 18" class="indicator">
          <path
            d="M12.252 3.48c-.115.033-.301.161-.425.291-.059.063-1.407 1.815-2.995 3.894s-2.897 3.79-2.908 3.802c-.013.014-.661-.616-1.672-1.624-.908-.905-1.702-1.681-1.765-1.723-.401-.27-.783-.211-1.176.183a1.285 1.285 0 0 0-.261.342.582.582 0 0 0-.082.35c0 .165.01.205.08.35.075.153.213.296 2.182 2.271 1.156 1.159 2.17 2.159 2.253 2.222.189.143.338.196.539.194.203-.003.412-.104.618-.299.205-.193 6.7-8.693 6.804-8.903a.716.716 0 0 0 .085-.345c.01-.179.005-.203-.062-.339-.124-.252-.45-.531-.746-.639a.784.784 0 0 0-.469-.027"
            fill-rule="evenodd"
          />
        </svg></div
    ></media-captions-menu>
  </template>

  <template partial="AirplayButton">
    <media-airplay-button part="bottom airplay button" disabled="{{disabled}}" aria-disabled="{{disabled}}">
      <svg viewBox="0 0 18 14" aria-hidden="true" slot="icon">
        <path
          d="M16.1383 0H1.8618C0.8335 0 0 0.8335 0 1.8617V10.1382C0 11.1664 0.8335 12 1.8618 12H3.076C3.1204 11.9433 3.1503 11.8785 3.2012 11.826L4.004 11H1.8618C1.3866 11 1 10.6134 1 10.1382V1.8617C1 1.3865 1.3866 0.9999 1.8618 0.9999H16.1383C16.6135 0.9999 17.0001 1.3865 17.0001 1.8617V10.1382C17.0001 10.6134 16.6135 11 16.1383 11H13.9961L14.7989 11.826C14.8499 11.8785 14.8798 11.9432 14.9241 12H16.1383C17.1665 12 18.0001 11.1664 18.0001 10.1382V1.8617C18 0.8335 17.1665 0 16.1383 0Z"
        />
        <path
          d="M9.55061 8.21903C9.39981 8.06383 9.20001 7.98633 9.00011 7.98633C8.80021 7.98633 8.60031 8.06383 8.44951 8.21903L4.09771 12.697C3.62471 13.1838 3.96961 13.9998 4.64831 13.9998H13.3518C14.0304 13.9998 14.3754 13.1838 13.9023 12.697L9.55061 8.21903Z"
        />
      </svg>
    </media-airplay-button>
  </template>

  <template partial="FullscreenButton">
    <media-fullscreen-button part="bottom fullscreen button" disabled="{{disabled}}" aria-disabled="{{disabled}}">
      <svg viewBox="0 0 18 14" aria-hidden="true" slot="enter">
        <path
          d="M1.00745 4.39539L1.01445 1.98789C1.01605 1.43049 1.47085 0.978289 2.02835 0.979989L6.39375 0.992589L6.39665 -0.007411L2.03125 -0.020011C0.920646 -0.023211 0.0176463 0.874489 0.0144463 1.98509L0.00744629 4.39539H1.00745Z"
        />
        <path
          d="M17.0144 2.03431L17.0076 4.39541H18.0076L18.0144 2.03721C18.0176 0.926712 17.1199 0.0237125 16.0093 0.0205125L11.6439 0.0078125L11.641 1.00781L16.0064 1.02041C16.5638 1.02201 17.016 1.47681 17.0144 2.03431Z"
        />
        <path
          d="M16.9925 9.60498L16.9855 12.0124C16.9839 12.5698 16.5291 13.022 15.9717 13.0204L11.6063 13.0078L11.6034 14.0078L15.9688 14.0204C17.0794 14.0236 17.9823 13.1259 17.9855 12.0153L17.9925 9.60498H16.9925Z"
        />
        <path
          d="M0.985626 11.9661L0.992426 9.60498H-0.0074737L-0.0142737 11.9632C-0.0174737 13.0738 0.880226 13.9767 1.99083 13.98L6.35623 13.9926L6.35913 12.9926L1.99373 12.98C1.43633 12.9784 0.983926 12.5236 0.985626 11.9661Z"
        />
      </svg>
      <svg viewBox="0 0 18 14" aria-hidden="true" slot="exit">
        <path
          d="M5.39655 -0.0200195L5.38955 2.38748C5.38795 2.94488 4.93315 3.39708 4.37565 3.39538L0.0103463 3.38278L0.00744629 4.38278L4.37285 4.39538C5.48345 4.39858 6.38635 3.50088 6.38965 2.39028L6.39665 -0.0200195H5.39655Z"
        />
        <path
          d="M12.6411 2.36891L12.6479 0.0078125H11.6479L11.6411 2.36601C11.6379 3.47651 12.5356 4.37951 13.6462 4.38271L18.0116 4.39531L18.0145 3.39531L13.6491 3.38271C13.0917 3.38111 12.6395 2.92641 12.6411 2.36891Z"
        />
        <path
          d="M12.6034 14.0204L12.6104 11.613C12.612 11.0556 13.0668 10.6034 13.6242 10.605L17.9896 10.6176L17.9925 9.61759L13.6271 9.60499C12.5165 9.60179 11.6136 10.4995 11.6104 11.6101L11.6034 14.0204H12.6034Z"
        />
        <path
          d="M5.359 11.6315L5.3522 13.9926H6.3522L6.359 11.6344C6.3622 10.5238 5.4645 9.62088 4.3539 9.61758L-0.0115043 9.60498L-0.0144043 10.605L4.351 10.6176C4.9084 10.6192 5.3607 11.074 5.359 11.6315Z"
        />
      </svg>
    </media-fullscreen-button>
  </template>

  <template partial="CastButton">
    <media-cast-button part="bottom cast button" disabled="{{disabled}}" aria-disabled="{{disabled}}">
      <svg viewBox="0 0 18 14" aria-hidden="true" slot="enter">
        <path
          d="M16.0072 0H2.0291C0.9185 0 0.0181 0.9003 0.0181 2.011V5.5009C0.357 5.5016 0.6895 5.5275 1.0181 5.5669V2.011C1.0181 1.4536 1.4716 1 2.029 1H16.0072C16.5646 1 17.0181 1.4536 17.0181 2.011V11.9891C17.0181 12.5465 16.5646 13 16.0072 13H8.4358C8.4746 13.3286 8.4999 13.6611 8.4999 13.9999H16.0071C17.1177 13.9999 18.018 13.0996 18.018 11.989V2.011C18.0181 0.9003 17.1178 0 16.0072 0ZM0 6.4999V7.4999C3.584 7.4999 6.5 10.4159 6.5 13.9999H7.5C7.5 9.8642 4.1357 6.4999 0 6.4999ZM0 8.7499V9.7499C2.3433 9.7499 4.25 11.6566 4.25 13.9999H5.25C5.25 11.1049 2.895 8.7499 0 8.7499ZM0.0181 11V14H3.0181C3.0181 12.3431 1.675 11 0.0181 11Z"
        />
      </svg>
      <svg viewBox="0 0 18 14" aria-hidden="true" slot="exit">
        <path
          d="M15.9891 0H2.01103C0.900434 0 3.35947e-05 0.9003 3.35947e-05 2.011V5.5009C0.338934 5.5016 0.671434 5.5275 1.00003 5.5669V2.011C1.00003 1.4536 1.45353 1 2.01093 1H15.9891C16.5465 1 17 1.4536 17 2.011V11.9891C17 12.5465 16.5465 13 15.9891 13H8.41773C8.45653 13.3286 8.48183 13.6611 8.48183 13.9999H15.989C17.0996 13.9999 17.9999 13.0996 17.9999 11.989V2.011C18 0.9003 17.0997 0 15.9891 0ZM-0.0180664 6.4999V7.4999C3.56593 7.4999 6.48193 10.4159 6.48193 13.9999H7.48193C7.48193 9.8642 4.11763 6.4999 -0.0180664 6.4999ZM-0.0180664 8.7499V9.7499C2.32523 9.7499 4.23193 11.6566 4.23193 13.9999H5.23193C5.23193 11.1049 2.87693 8.7499 -0.0180664 8.7499ZM3.35947e-05 11V14H3.00003C3.00003 12.3431 1.65693 11 3.35947e-05 11Z"
        />
        <path d="M2.15002 5.634C5.18352 6.4207 7.57252 8.8151 8.35282 11.8499H15.8501V2.1499H2.15002V5.634Z" />
      </svg>
    </media-cast-button>
  </template>

  <template partial="LiveButton">
    <media-live-button part="{{section ?? 'top'}} live button" disabled="{{disabled}}" aria-disabled="{{disabled}}">
      <span slot="text">Live</span>
    </media-live-button>
  </template>

  <template partial="PlaybackRateMenu">
    <media-playback-rate-menu-button part="bottom playback-rate button"></media-playback-rate-menu-button>
    <media-playback-rate-menu
      hidden
      anchor="auto"
      rates="{{playbackrates}}"
      exportparts="menu-item"
      part="bottom playback-rate menu"
      disabled="{{disabled}}"
      aria-disabled="{{disabled}}"
    ></media-playback-rate-menu>
  </template>

  <template partial="VolumeRange">
    <media-volume-range
      part="bottom volume range"
      disabled="{{disabled}}"
      aria-disabled="{{disabled}}"
    ></media-volume-range>
  </template>

  <template partial="TimeDisplay">
    <media-time-display
      remaining="{{defaultshowremainingtime}}"
      showduration="{{!hideduration}}"
      part="bottom time display"
      disabled="{{disabled}}"
      aria-disabled="{{disabled}}"
    ></media-time-display>
  </template>

  <template partial="TimeRange">
    <media-time-range part="bottom time range" disabled="{{disabled}}" aria-disabled="{{disabled}}" exportparts="thumb">
      <media-preview-thumbnail slot="preview"></media-preview-thumbnail>
      <media-preview-chapter-display slot="preview"></media-preview-chapter-display>
      <media-preview-time-display slot="preview"></media-preview-time-display>
      <div slot="preview" part="arrow"></div>
    </media-time-range>
  </template>

  <template partial="AudioTrackMenu">
    <media-audio-track-menu-button part="bottom audio-track button">
      <svg aria-hidden="true" slot="icon" viewBox="0 0 18 16">
        <path d="M9 15A7 7 0 1 1 9 1a7 7 0 0 1 0 14Zm0 1A8 8 0 1 0 9 0a8 8 0 0 0 0 16Z" />
        <path
          d="M5.2 6.3a.5.5 0 0 1 .5.5v2.4a.5.5 0 1 1-1 0V6.8a.5.5 0 0 1 .5-.5Zm2.4-2.4a.5.5 0 0 1 .5.5v7.2a.5.5 0 0 1-1 0V4.4a.5.5 0 0 1 .5-.5ZM10 5.5a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.4-.8a.5.5 0 0 1 .5.5v5.6a.5.5 0 0 1-1 0V5.2a.5.5 0 0 1 .5-.5Z"
        />
      </svg>
    </media-audio-track-menu-button>
    <media-audio-track-menu
      hidden
      anchor="auto"
      part="bottom audio-track menu"
      disabled="{{disabled}}"
      aria-disabled="{{disabled}}"
      exportparts="menu-item"
    >
      <div slot="checked-indicator">
        <style>
          .indicator {
            position: relative;
            top: 1px;
            width: 0.9em;
            height: auto;
            fill: var(--_accent-color);
            margin-right: 5px;
          }

          [aria-checked='false'] .indicator {
            display: none;
          }
        </style>
        <svg viewBox="0 0 14 18" class="indicator">
          <path
            d="M12.252 3.48c-.115.033-.301.161-.425.291-.059.063-1.407 1.815-2.995 3.894s-2.897 3.79-2.908 3.802c-.013.014-.661-.616-1.672-1.624-.908-.905-1.702-1.681-1.765-1.723-.401-.27-.783-.211-1.176.183a1.285 1.285 0 0 0-.261.342.582.582 0 0 0-.082.35c0 .165.01.205.08.35.075.153.213.296 2.182 2.271 1.156 1.159 2.17 2.159 2.253 2.222.189.143.338.196.539.194.203-.003.412-.104.618-.299.205-.193 6.7-8.693 6.804-8.903a.716.716 0 0 0 .085-.345c.01-.179.005-.203-.062-.339-.124-.252-.45-.531-.746-.639a.784.784 0 0 0-.469-.027"
            fill-rule="evenodd"
          />
        </svg>
      </div>
    </media-audio-track-menu>
  </template>

  <template partial="RenditionMenu">
    <media-rendition-menu-button part="bottom rendition button">
      <svg aria-hidden="true" slot="icon" viewBox="0 0 18 14">
        <path
          d="M2.25 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM9 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm6.75 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"
        />
      </svg>
    </media-rendition-menu-button>
    <media-rendition-menu
      hidden
      anchor="auto"
      part="bottom rendition menu"
      disabled="{{disabled}}"
      aria-disabled="{{disabled}}"
    >
      <div slot="checked-indicator">
        <style>
          .indicator {
            position: relative;
            top: 1px;
            width: 0.9em;
            height: auto;
            fill: var(--_accent-color);
            margin-right: 5px;
          }

          [aria-checked='false'] .indicator {
            opacity: 0;
          }
        </style>
        <svg viewBox="0 0 14 18" class="indicator">
          <path
            d="M12.252 3.48c-.115.033-.301.161-.425.291-.059.063-1.407 1.815-2.995 3.894s-2.897 3.79-2.908 3.802c-.013.014-.661-.616-1.672-1.624-.908-.905-1.702-1.681-1.765-1.723-.401-.27-.783-.211-1.176.183a1.285 1.285 0 0 0-.261.342.582.582 0 0 0-.082.35c0 .165.01.205.08.35.075.153.213.296 2.182 2.271 1.156 1.159 2.17 2.159 2.253 2.222.189.143.338.196.539.194.203-.003.412-.104.618-.299.205-.193 6.7-8.693 6.804-8.903a.716.716 0 0 0 .085-.345c.01-.179.005-.203-.062-.339-.124-.252-.45-.531-.746-.639a.784.784 0 0 0-.469-.027"
            fill-rule="evenodd"
          />
        </svg>
      </div>
    </media-rendition-menu>
  </template>

  <template partial="MuxBadge">
    <div part="mux-badge">
      <a href="https://www.mux.com/player" target="_blank">
        <span class="mux-badge-text">Powered by</span>
        <div class="mux-badge-logo">
          <svg
            viewBox="0 0 1600 500"
            style="fill-rule: evenodd; clip-rule: evenodd; stroke-linejoin: round; stroke-miterlimit: 2"
          >
            <g>
              <path
                d="M994.287,93.486c-17.121,-0 -31,-13.879 -31,-31c0,-17.121 13.879,-31 31,-31c17.121,-0 31,13.879 31,31c0,17.121 -13.879,31 -31,31m0,-93.486c-34.509,-0 -62.484,27.976 -62.484,62.486l0,187.511c0,68.943 -56.09,125.033 -125.032,125.033c-68.942,-0 -125.03,-56.09 -125.03,-125.033l0,-187.511c0,-34.51 -27.976,-62.486 -62.485,-62.486c-34.509,-0 -62.484,27.976 -62.484,62.486l0,187.511c0,137.853 112.149,250.003 249.999,250.003c137.851,-0 250.001,-112.15 250.001,-250.003l0,-187.511c0,-34.51 -27.976,-62.486 -62.485,-62.486"
                style="fill-rule: nonzero"
              ></path>
              <path
                d="M1537.51,468.511c-17.121,-0 -31,-13.879 -31,-31c0,-17.121 13.879,-31 31,-31c17.121,-0 31,13.879 31,31c0,17.121 -13.879,31 -31,31m-275.883,-218.509l-143.33,143.329c-24.402,24.402 -24.402,63.966 0,88.368c24.402,24.402 63.967,24.402 88.369,-0l143.33,-143.329l143.328,143.329c24.402,24.4 63.967,24.402 88.369,-0c24.403,-24.402 24.403,-63.966 0.001,-88.368l-143.33,-143.329l0.001,-0.004l143.329,-143.329c24.402,-24.402 24.402,-63.965 0,-88.367c-24.402,-24.402 -63.967,-24.402 -88.369,-0l-143.329,143.328l-143.329,-143.328c-24.402,-24.401 -63.967,-24.402 -88.369,-0c-24.402,24.402 -24.402,63.965 0,88.367l143.329,143.329l0,0.004Z"
                style="fill-rule: nonzero"
              ></path>
              <path
                d="M437.511,468.521c-17.121,-0 -31,-13.879 -31,-31c0,-17.121 13.879,-31 31,-31c17.121,-0 31,13.879 31,31c0,17.121 -13.879,31 -31,31m23.915,-463.762c-23.348,-9.672 -50.226,-4.327 -68.096,13.544l-143.331,143.329l-143.33,-143.329c-17.871,-17.871 -44.747,-23.216 -68.096,-13.544c-23.349,9.671 -38.574,32.455 -38.574,57.729l0,375.026c0,34.51 27.977,62.486 62.487,62.486c34.51,-0 62.486,-27.976 62.486,-62.486l0,-224.173l80.843,80.844c24.404,24.402 63.965,24.402 88.369,-0l80.843,-80.844l0,224.173c0,34.51 27.976,62.486 62.486,62.486c34.51,-0 62.486,-27.976 62.486,-62.486l0,-375.026c0,-25.274 -15.224,-48.058 -38.573,-57.729"
                style="fill-rule: nonzero"
              ></path>
            </g>
          </svg>
        </div>
      </a>
    </div>
  </template>

  <media-controller
    part="controller"
    defaultstreamtype="{{defaultstreamtype ?? 'on-demand'}}"
    breakpoints="sm:470"
    gesturesdisabled="{{disabled}}"
    hotkeys="{{hotkeys}}"
    nohotkeys="{{nohotkeys}}"
    novolumepref="{{novolumepref}}"
    audio="{{audio}}"
    noautoseektolive="{{noautoseektolive}}"
    defaultsubtitles="{{defaultsubtitles}}"
    defaultduration="{{defaultduration ?? false}}"
    keyboardforwardseekoffset="{{forwardseekoffset}}"
    keyboardbackwardseekoffset="{{backwardseekoffset}}"
    exportparts="layer, media-layer, poster-layer, vertical-layer, centered-layer, gesture-layer"
    style="--_pre-playback-place:{{preplaybackplace ?? 'center'}}"
  >
    <slot name="media" slot="media"></slot>
    <slot name="poster" slot="poster"></slot>

    <media-loading-indicator slot="centered-chrome" noautohide></media-loading-indicator>

    <template if="!audio">
      <media-error-dialog slot="dialog" noautohide></media-error-dialog>
      <!-- Pre-playback UI -->
      <!-- same for both on-demand and live -->
      <div slot="centered-chrome" class="center-controls pre-playback">
        <template if="!breakpointsm">{{>PlayButton section="center"}}</template>
        <template if="breakpointsm">{{>PrePlayButton section="center"}}</template>
      </div>

      <!-- Mux Badge -->
      <template if="proudlydisplaymuxbadge"> {{>MuxBadge}} </template>

      <!-- Autoplay centered unmute button -->
      <!--
        todo: figure out how show this with available state variables
        needs to show when:
        - autoplay is enabled
        - playback has been successful
        - audio is muted
        - in place / instead of the pre-plaback play button
        - not to show again after user has interacted with this button
          - OR user has interacted with the mute button in the control bar
      -->
      <!--
        There should be a >MuteButton to the left of the "Unmute" text, but a templating bug
        makes it appear even if commented out in the markup, add it back when code is un-commented
      -->
      <!-- <div slot="centered-chrome" class="autoplay-unmute">
        <div role="button" class="autoplay-unmute-btn">Unmute</div>
      </div> -->

      <template if="streamtype == 'on-demand'">
        <template if="breakpointsm">
          <media-control-bar part="control-bar top" slot="top-chrome">{{>TitleDisplay}} </media-control-bar>
        </template>
        {{>TimeRange}}
        <media-control-bar part="control-bar bottom">
          {{>PlayButton}} {{>SeekBackwardButton}} {{>SeekForwardButton}} {{>TimeDisplay}} {{>MuteButton}}
          {{>VolumeRange}}
          <div class="spacer"></div>
          {{>RenditionMenu}} {{>PlaybackRateMenu}} {{>AudioTrackMenu}} {{>CaptionsMenu}} {{>AirplayButton}}
          {{>CastButton}} {{>PipButton}} {{>FullscreenButton}}
        </media-control-bar>
      </template>

      <template if="streamtype == 'live'">
        <media-control-bar part="control-bar top" slot="top-chrome">
          {{>LiveButton}}
          <template if="breakpointsm"> {{>TitleDisplay}} </template>
        </media-control-bar>
        <template if="targetlivewindow > 0">{{>TimeRange}}</template>
        <media-control-bar part="control-bar bottom">
          {{>PlayButton}}
          <template if="targetlivewindow > 0">{{>SeekBackwardButton}} {{>SeekForwardButton}}</template>
          {{>MuteButton}} {{>VolumeRange}}
          <div class="spacer"></div>
          {{>RenditionMenu}} {{>AudioTrackMenu}} {{>CaptionsMenu}} {{>AirplayButton}} {{>CastButton}} {{>PipButton}}
          {{>FullscreenButton}}
        </media-control-bar>
      </template>
    </template>

    <template if="audio">
      <template if="streamtype == 'on-demand'">
        <template if="title">
          <media-control-bar part="control-bar top">{{>TitleDisplay}}</media-control-bar>
        </template>
        <media-control-bar part="control-bar bottom">
          {{>PlayButton}}
          <template if="breakpointsm"> {{>SeekBackwardButton}} {{>SeekForwardButton}} </template>
          {{>MuteButton}}
          <template if="breakpointsm">{{>VolumeRange}}</template>
          {{>TimeDisplay}} {{>TimeRange}}
          <template if="breakpointsm">{{>PlaybackRateMenu}}</template>
          {{>AirplayButton}} {{>CastButton}}
        </media-control-bar>
      </template>

      <template if="streamtype == 'live'">
        <template if="title">
          <media-control-bar part="control-bar top">{{>TitleDisplay}}</media-control-bar>
        </template>
        <media-control-bar part="control-bar bottom">
          {{>PlayButton}} {{>LiveButton section="bottom"}} {{>MuteButton}}
          <template if="breakpointsm">
            {{>VolumeRange}}
            <template if="targetlivewindow > 0"> {{>SeekBackwardButton}} {{>SeekForwardButton}} </template>
          </template>
          <template if="targetlivewindow > 0"> {{>TimeDisplay}} {{>TimeRange}} </template>
          <template if="!targetlivewindow"><div class="spacer"></div></template>
          {{>AirplayButton}} {{>CastButton}}
        </media-control-bar>
      </template>
    </template>

    <slot></slot>
  </media-controller>
</template>
`,hN=m8.createElement("template");"innerHTML"in hN&&(hN.innerHTML=hx);var hO,hP,hU=class extends sO{};hU.template=null==(hP=null==(hO=hN.content)?void 0:hO.children)?void 0:hP[0],m9.customElements.get("media-theme-gerwig")||m9.customElements.define("media-theme-gerwig",hU);var hW={SRC:"src",POSTER:"poster"},h$={STYLE:"style",DEFAULT_HIDDEN_CAPTIONS:"default-hidden-captions",PRIMARY_COLOR:"primary-color",SECONDARY_COLOR:"secondary-color",ACCENT_COLOR:"accent-color",FORWARD_SEEK_OFFSET:"forward-seek-offset",BACKWARD_SEEK_OFFSET:"backward-seek-offset",PLAYBACK_TOKEN:"playback-token",THUMBNAIL_TOKEN:"thumbnail-token",STORYBOARD_TOKEN:"storyboard-token",FULLSCREEN_ELEMENT:"fullscreen-element",DRM_TOKEN:"drm-token",STORYBOARD_SRC:"storyboard-src",THUMBNAIL_TIME:"thumbnail-time",AUDIO:"audio",NOHOTKEYS:"nohotkeys",HOTKEYS:"hotkeys",PLAYBACK_RATES:"playbackrates",DEFAULT_SHOW_REMAINING_TIME:"default-show-remaining-time",DEFAULT_DURATION:"default-duration",TITLE:"title",VIDEO_TITLE:"video-title",PLACEHOLDER:"placeholder",THEME:"theme",DEFAULT_STREAM_TYPE:"default-stream-type",TARGET_LIVE_WINDOW:"target-live-window",EXTRA_SOURCE_PARAMS:"extra-source-params",NO_VOLUME_PREF:"no-volume-pref",NO_MUTED_PREF:"no-muted-pref",CAST_RECEIVER:"cast-receiver",NO_TOOLTIPS:"no-tooltips",PROUDLY_DISPLAY_MUX_BADGE:"proudly-display-mux-badge",DISABLE_PSEUDO_ENDED:"disable-pseudo-ended"},hB=["audio","backwardseekoffset","defaultduration","defaultshowremainingtime","defaultsubtitles","noautoseektolive","disabled","exportparts","forwardseekoffset","hideduration","hotkeys","nohotkeys","playbackrates","defaultstreamtype","streamtype","style","targetlivewindow","template","title","videotitle","novolumepref","nomutedpref","proudlydisplaymuxbadge"],hH=r1.formatErrorMessage;function hV(e){let t=e.videoTitle?{video_title:e.videoTitle}:{};return e.getAttributeNames().filter(e=>e.startsWith("metadata-")).reduce((t,i)=>{let a=e.getAttribute(i);return null!==a&&(t[i.replace(/^metadata-/,"").replace(/-/g,"_")]=a),t},t)}r1.formatErrorMessage=e=>{var t,i;if(e instanceof l){let a=((e,t=!1)=>({title:((e,t=!1)=>{var i,a;if(e.muxCode){let r=hL(null!=(i=e.errorCategory)?i:"video"),l=o(null!=(a=e.errorCategory)?a:n.VIDEO);if(e.muxCode===s.NETWORK_OFFLINE)return M("Your device appears to be offline",t);if(e.muxCode===s.NETWORK_TOKEN_EXPIRED)return M("{category} URL has expired",t).format({category:r});if([s.NETWORK_TOKEN_SUB_MISMATCH,s.NETWORK_TOKEN_AUD_MISMATCH,s.NETWORK_TOKEN_AUD_MISSING,s.NETWORK_TOKEN_MALFORMED].includes(e.muxCode))return M("{category} URL is formatted incorrectly",t).format({category:r});if(e.muxCode===s.NETWORK_TOKEN_MISSING)return M("Invalid {categoryName} URL",t).format({categoryName:l});if(e.muxCode===s.NETWORK_NOT_FOUND)return M("{category} does not exist",t).format({category:r});if(e.muxCode===s.NETWORK_NOT_READY){let i="live"===e.streamType?"Live stream":"Video";return M("{mediaType} is not currently available",t).format({mediaType:i})}}if(e.code){if(e.code===l.MEDIA_ERR_NETWORK)return M("Network Error",t);if(e.code===l.MEDIA_ERR_DECODE)return M("Media Error",t);if(e.code===l.MEDIA_ERR_SRC_NOT_SUPPORTED)return M("Source Not Supported",t)}return M("Error",t)})(e,t).toString(),message:((e,t=!1)=>{var i,a;if(e.muxCode){let r=hL(null!=(i=e.errorCategory)?i:"video"),l=o(null!=(a=e.errorCategory)?a:n.VIDEO);return e.muxCode===s.NETWORK_OFFLINE?M("Check your internet connection and try reloading this video.",t):e.muxCode===s.NETWORK_TOKEN_EXPIRED?M("The video’s secured {tokenNamePrefix}-token has expired.",t).format({tokenNamePrefix:l}):e.muxCode===s.NETWORK_TOKEN_SUB_MISMATCH?M("The video’s playback ID does not match the one encoded in the {tokenNamePrefix}-token.",t).format({tokenNamePrefix:l}):e.muxCode===s.NETWORK_TOKEN_MALFORMED?M("{category} URL is formatted incorrectly",t).format({category:r}):[s.NETWORK_TOKEN_AUD_MISMATCH,s.NETWORK_TOKEN_AUD_MISSING].includes(e.muxCode)?M("The {tokenNamePrefix}-token is formatted with incorrect information.",t).format({tokenNamePrefix:l}):[s.NETWORK_TOKEN_MISSING,s.NETWORK_INVALID_URL].includes(e.muxCode)?M("The video URL or {tokenNamePrefix}-token are formatted with incorrect or incomplete information.",t).format({tokenNamePrefix:l}):e.muxCode===s.NETWORK_NOT_FOUND?"":e.message}return e.code&&(e.code===l.MEDIA_ERR_NETWORK||e.code===l.MEDIA_ERR_DECODE||e.code===l.MEDIA_ERR_SRC_NOT_SUPPORTED),e.message})(e,t).toString()}))(e,!1);return`
      ${null!=a&&a.title?`<h3>${a.title}</h3>`:""}
      ${null!=a&&a.message||null!=a&&a.linkUrl?`<p>
        ${null==a?void 0:a.message}
        ${null!=a&&a.linkUrl?`<a
              href="${a.linkUrl}"
              target="_blank"
              rel="external noopener"
              aria-label="${null!=(t=a.linkText)?t:""} ${M("(opens in a new window)")}"
              >${null!=(i=a.linkText)?i:a.linkUrl}</a
            >`:""}
      </p>`:""}
    `}return hH(e)};var hK,hF,hY,hG,hq,hj,hZ,hQ,hz,hX,hJ,h0,h1,h2,h3,h4=Object.values(tp),h5=Object.values(hW),h9=Object.values(h$),h8="mux-player",h6={isDialogOpen:!1},h7={redundant_streams:!0},ce=class extends hA{constructor(){super(),oZ(this,hZ),oZ(this,hK),oZ(this,hF,!1),oZ(this,hY,{}),oZ(this,hG,!0),oZ(this,hq,new hu(this,"hotkeys")),oZ(this,hj,{...h6,onCloseErrorDialog:e=>{var t;(null==(t=e.composedPath()[0])?void 0:t.localName)==="media-error-dialog"&&oz(this,hZ,hX).call(this,{isDialogOpen:!1})},onFocusInErrorDialog:e=>{var t;(null==(t=e.composedPath()[0])?void 0:t.localName)==="media-error-dialog"&&(hn(this,m8.activeElement)||e.preventDefault())}}),oQ(this,hK,e_()),this.attachShadow({mode:"open"}),oz(this,hZ,hz).call(this),this.isConnected&&oz(this,hZ,hQ).call(this)}static get NAME(){return h8}static get VERSION(){return ho}static get observedAttributes(){var e;return[...null!=(e=hA.observedAttributes)?e:[],...h5,...h4,...h9]}get mediaTheme(){var e;return null==(e=this.shadowRoot)?void 0:e.querySelector("media-theme")}get mediaController(){var e,t;return null==(t=null==(e=this.mediaTheme)?void 0:e.shadowRoot)?void 0:t.querySelector("media-controller")}connectedCallback(){let e=this.media;e&&(e.metadata=hV(this))}attributeChangedCallback(e,t,i){var a;switch(oz(this,hZ,hQ).call(this),super.attributeChangedCallback(e,t,i),e){case h$.HOTKEYS:oj(this,hq).value=i;break;case h$.THUMBNAIL_TIME:null!=i&&this.tokens.thumbnail&&hh(M("Use of thumbnail-time with thumbnail-token is currently unsupported. Ignore thumbnail-time.").toString());break;case h$.THUMBNAIL_TOKEN:if(i){let e=S(i);if(e){let{aud:t}=e,i=ei.THUMBNAIL;t!==i&&hh(M("The {tokenNamePrefix}-token has an incorrect aud value: {aud}. aud value should be {expectedAud}.").format({aud:t,expectedAud:i,tokenNamePrefix:"thumbnail"}))}}break;case h$.STORYBOARD_TOKEN:if(i){let e=S(i);if(e){let{aud:t}=e,i=ei.STORYBOARD;t!==i&&hh(M("The {tokenNamePrefix}-token has an incorrect aud value: {aud}. aud value should be {expectedAud}.").format({aud:t,expectedAud:i,tokenNamePrefix:"storyboard"}))}}break;case h$.DRM_TOKEN:if(i){let e=S(i);if(e){let{aud:t}=e,i=ei.DRM;t!==i&&hh(M("The {tokenNamePrefix}-token has an incorrect aud value: {aud}. aud value should be {expectedAud}.").format({aud:t,expectedAud:i,tokenNamePrefix:"drm"}))}}break;case tp.PLAYBACK_ID:null!=i&&i.includes("?token")&&hc(M("The specificed playback ID {playbackId} contains a token which must be provided via the playback-token attribute.").format({playbackId:i}));break;case tp.STREAM_TYPE:i&&![m.LIVE,m.ON_DEMAND,m.UNKNOWN].includes(i)?["ll-live","live:dvr","ll-live:dvr"].includes(this.streamType)?this.targetLiveWindow=i.includes("dvr")?1/0:0:hp({file:"invalid-stream-type.md",message:M("Invalid stream-type value supplied: `{streamType}`. Please provide stream-type as either: `on-demand` or `live`").format({streamType:this.streamType})}):i===m.LIVE?null==this.getAttribute(h$.TARGET_LIVE_WINDOW)&&(this.targetLiveWindow=0):this.targetLiveWindow=NaN;break;case h$.FULLSCREEN_ELEMENT:if(null!=i||i!==t){let e=m8.getElementById(i),t=null==e?void 0:e.querySelector("mux-player");this.mediaController&&e&&t&&(this.mediaController.fullscreenElement=e)}}[tp.PLAYBACK_ID,hW.SRC,h$.PLAYBACK_TOKEN].includes(e)&&t!==i&&oQ(this,hj,{...oj(this,hj),...h6}),oz(this,hZ,hJ).call(this,{[null!=(a=hd[e])?a:m7(e)]:i})}async requestFullscreen(e){var t;if(!(!this.mediaController||this.mediaController.hasAttribute(tW.MEDIA_IS_FULLSCREEN)))return null==(t=this.mediaController)||t.dispatchEvent(new m9.CustomEvent(tN.MEDIA_ENTER_FULLSCREEN_REQUEST,{composed:!0,bubbles:!0})),new Promise((e,t)=>{var i;null==(i=this.mediaController)||i.addEventListener(t$.MEDIA_IS_FULLSCREEN,()=>e(),{once:!0})})}async exitFullscreen(){var e;if(!(!this.mediaController||!this.mediaController.hasAttribute(tW.MEDIA_IS_FULLSCREEN)))return null==(e=this.mediaController)||e.dispatchEvent(new m9.CustomEvent(tN.MEDIA_EXIT_FULLSCREEN_REQUEST,{composed:!0,bubbles:!0})),new Promise((e,t)=>{var i;null==(i=this.mediaController)||i.addEventListener(t$.MEDIA_IS_FULLSCREEN,()=>e(),{once:!0})})}get preferCmcd(){var e;return null!=(e=this.getAttribute(tp.PREFER_CMCD))?e:void 0}set preferCmcd(e){e!==this.preferCmcd&&(e?p.includes(e)?this.setAttribute(tp.PREFER_CMCD,e):hh(`Invalid value for preferCmcd. Must be one of ${p.join()}`):this.removeAttribute(tp.PREFER_CMCD))}get hasPlayed(){var e,t;return null!=(t=null==(e=this.mediaController)?void 0:e.hasAttribute(tW.MEDIA_HAS_PLAYED))&&t}get inLiveWindow(){var e;return null==(e=this.mediaController)?void 0:e.hasAttribute(tW.MEDIA_TIME_IS_LIVE)}get _hls(){var e;return null==(e=this.media)?void 0:e._hls}get mux(){var e;return null==(e=this.media)?void 0:e.mux}get theme(){var e;return null!=(e=this.getAttribute(h$.THEME))?e:"gerwig"}set theme(e){this.setAttribute(h$.THEME,`${e}`)}get themeProps(){let e=this.mediaTheme;if(!e)return;let t={};for(let i of e.getAttributeNames()){if(hB.includes(i))continue;let a=e.getAttribute(i);t[m7(i)]=""===a||a}return t}set themeProps(e){var t,i;oz(this,hZ,hQ).call(this);let a={...this.themeProps,...e};for(let r in a){if(hB.includes(r))continue;let a=null==e?void 0:e[r];"boolean"==typeof a||null==a?null==(t=this.mediaTheme)||t.toggleAttribute(m6(r),!!a):null==(i=this.mediaTheme)||i.setAttribute(m6(r),a)}}get playbackId(){var e;return null!=(e=this.getAttribute(tp.PLAYBACK_ID))?e:void 0}set playbackId(e){e?this.setAttribute(tp.PLAYBACK_ID,e):this.removeAttribute(tp.PLAYBACK_ID)}get src(){var e,t;return this.playbackId?null!=(e=ct(this,hW.SRC))?e:void 0:null!=(t=this.getAttribute(hW.SRC))?t:void 0}set src(e){e?this.setAttribute(hW.SRC,e):this.removeAttribute(hW.SRC)}get poster(){var e;let t=this.getAttribute(hW.POSTER);if(null!=t)return t;let{tokens:i}=this;return i.playback&&!i.thumbnail?void hh("Missing expected thumbnail token. No poster image will be shown"):this.playbackId&&!this.audio?((e,{token:t,customDomain:i=hs,thumbnailTime:a,programTime:r}={})=>{var n;let s=null==t?a:void 0,{aud:o}=null!=(n=S(t))?n:{};if(!(t&&"t"!==o))return`https://image.${i}/${e}/thumbnail.webp${ht({token:t,time:s,program_time:r})}`})(this.playbackId,{customDomain:this.customDomain,thumbnailTime:null!=(e=this.thumbnailTime)?e:this.startTime,programTime:this.programStartTime,token:i.thumbnail}):void 0}set poster(e){e||""===e?this.setAttribute(hW.POSTER,e):this.removeAttribute(hW.POSTER)}get storyboardSrc(){var e;return null!=(e=this.getAttribute(h$.STORYBOARD_SRC))?e:void 0}set storyboardSrc(e){e?this.setAttribute(h$.STORYBOARD_SRC,e):this.removeAttribute(h$.STORYBOARD_SRC)}get storyboard(){let{tokens:e}=this;return this.storyboardSrc&&!e.storyboard?this.storyboardSrc:this.audio||!this.playbackId||!this.streamType||[m.LIVE,m.UNKNOWN].includes(this.streamType)||e.playback&&!e.storyboard?void 0:((e,{token:t,customDomain:i=hs,programStartTime:a,programEndTime:r}={})=>{var n;let{aud:s}=null!=(n=S(t))?n:{};if(!(t&&"s"!==s))return`https://image.${i}/${e}/storyboard.vtt${ht({token:t,format:"webp",program_start_time:a,program_end_time:r})}`})(this.playbackId,{customDomain:this.customDomain,token:e.storyboard,programStartTime:this.programStartTime,programEndTime:this.programEndTime})}get audio(){return this.hasAttribute(h$.AUDIO)}set audio(e){e?this.setAttribute(h$.AUDIO,""):this.removeAttribute(h$.AUDIO)}get hotkeys(){return oj(this,hq)}get nohotkeys(){return this.hasAttribute(h$.NOHOTKEYS)}set nohotkeys(e){e?this.setAttribute(h$.NOHOTKEYS,""):this.removeAttribute(h$.NOHOTKEYS)}get thumbnailTime(){return he(this.getAttribute(h$.THUMBNAIL_TIME))}set thumbnailTime(e){this.setAttribute(h$.THUMBNAIL_TIME,`${e}`)}get videoTitle(){var e,t;return null!=(t=null!=(e=this.getAttribute(h$.VIDEO_TITLE))?e:this.getAttribute(h$.TITLE))?t:""}set videoTitle(e){e!==this.videoTitle&&(e?this.setAttribute(h$.VIDEO_TITLE,e):this.removeAttribute(h$.VIDEO_TITLE))}get placeholder(){var e;return null!=(e=ct(this,h$.PLACEHOLDER))?e:""}set placeholder(e){this.setAttribute(h$.PLACEHOLDER,`${e}`)}get primaryColor(){var e,t;let i=this.getAttribute(h$.PRIMARY_COLOR);if(null!=i||this.mediaTheme&&(i=null==(t=null==(e=m9.getComputedStyle(this.mediaTheme))?void 0:e.getPropertyValue("--_primary-color"))?void 0:t.trim()))return i}set primaryColor(e){this.setAttribute(h$.PRIMARY_COLOR,`${e}`)}get secondaryColor(){var e,t;let i=this.getAttribute(h$.SECONDARY_COLOR);if(null!=i||this.mediaTheme&&(i=null==(t=null==(e=m9.getComputedStyle(this.mediaTheme))?void 0:e.getPropertyValue("--_secondary-color"))?void 0:t.trim()))return i}set secondaryColor(e){this.setAttribute(h$.SECONDARY_COLOR,`${e}`)}get accentColor(){var e,t;let i=this.getAttribute(h$.ACCENT_COLOR);if(null!=i||this.mediaTheme&&(i=null==(t=null==(e=m9.getComputedStyle(this.mediaTheme))?void 0:e.getPropertyValue("--_accent-color"))?void 0:t.trim()))return i}set accentColor(e){this.setAttribute(h$.ACCENT_COLOR,`${e}`)}get defaultShowRemainingTime(){return this.hasAttribute(h$.DEFAULT_SHOW_REMAINING_TIME)}set defaultShowRemainingTime(e){e?this.setAttribute(h$.DEFAULT_SHOW_REMAINING_TIME,""):this.removeAttribute(h$.DEFAULT_SHOW_REMAINING_TIME)}get playbackRates(){if(this.hasAttribute(h$.PLAYBACK_RATES))return this.getAttribute(h$.PLAYBACK_RATES).trim().split(/\s*,?\s+/).map(e=>Number(e)).filter(e=>!Number.isNaN(e)).sort((e,t)=>e-t)}set playbackRates(e){e?this.setAttribute(h$.PLAYBACK_RATES,e.join(" ")):this.removeAttribute(h$.PLAYBACK_RATES)}get forwardSeekOffset(){var e;return null!=(e=he(this.getAttribute(h$.FORWARD_SEEK_OFFSET)))?e:10}set forwardSeekOffset(e){this.setAttribute(h$.FORWARD_SEEK_OFFSET,`${e}`)}get backwardSeekOffset(){var e;return null!=(e=he(this.getAttribute(h$.BACKWARD_SEEK_OFFSET)))?e:10}set backwardSeekOffset(e){this.setAttribute(h$.BACKWARD_SEEK_OFFSET,`${e}`)}get defaultHiddenCaptions(){return this.hasAttribute(h$.DEFAULT_HIDDEN_CAPTIONS)}set defaultHiddenCaptions(e){e?this.setAttribute(h$.DEFAULT_HIDDEN_CAPTIONS,""):this.removeAttribute(h$.DEFAULT_HIDDEN_CAPTIONS)}get defaultDuration(){return he(this.getAttribute(h$.DEFAULT_DURATION))}set defaultDuration(e){null==e?this.removeAttribute(h$.DEFAULT_DURATION):this.setAttribute(h$.DEFAULT_DURATION,`${e}`)}get playerInitTime(){return this.hasAttribute(tp.PLAYER_INIT_TIME)?he(this.getAttribute(tp.PLAYER_INIT_TIME)):oj(this,hK)}set playerInitTime(e){e!=this.playerInitTime&&(null==e?this.removeAttribute(tp.PLAYER_INIT_TIME):this.setAttribute(tp.PLAYER_INIT_TIME,`${+e}`))}get playerSoftwareName(){var e;return null!=(e=this.getAttribute(tp.PLAYER_SOFTWARE_NAME))?e:h8}get playerSoftwareVersion(){var e;return null!=(e=this.getAttribute(tp.PLAYER_SOFTWARE_VERSION))?e:ho}get beaconCollectionDomain(){var e;return null!=(e=this.getAttribute(tp.BEACON_COLLECTION_DOMAIN))?e:void 0}set beaconCollectionDomain(e){e!==this.beaconCollectionDomain&&(e?this.setAttribute(tp.BEACON_COLLECTION_DOMAIN,e):this.removeAttribute(tp.BEACON_COLLECTION_DOMAIN))}get maxResolution(){var e;return null!=(e=this.getAttribute(tp.MAX_RESOLUTION))?e:void 0}set maxResolution(e){e!==this.maxResolution&&(e?this.setAttribute(tp.MAX_RESOLUTION,e):this.removeAttribute(tp.MAX_RESOLUTION))}get minResolution(){var e;return null!=(e=this.getAttribute(tp.MIN_RESOLUTION))?e:void 0}set minResolution(e){e!==this.minResolution&&(e?this.setAttribute(tp.MIN_RESOLUTION,e):this.removeAttribute(tp.MIN_RESOLUTION))}get maxAutoResolution(){var e;return null!=(e=this.getAttribute(tp.MAX_AUTO_RESOLUTION))?e:void 0}set maxAutoResolution(e){null==e?this.removeAttribute(tp.MAX_AUTO_RESOLUTION):this.setAttribute(tp.MAX_AUTO_RESOLUTION,e)}get renditionOrder(){var e;return null!=(e=this.getAttribute(tp.RENDITION_ORDER))?e:void 0}set renditionOrder(e){e!==this.renditionOrder&&(e?this.setAttribute(tp.RENDITION_ORDER,e):this.removeAttribute(tp.RENDITION_ORDER))}get programStartTime(){return he(this.getAttribute(tp.PROGRAM_START_TIME))}set programStartTime(e){null==e?this.removeAttribute(tp.PROGRAM_START_TIME):this.setAttribute(tp.PROGRAM_START_TIME,`${e}`)}get programEndTime(){return he(this.getAttribute(tp.PROGRAM_END_TIME))}set programEndTime(e){null==e?this.removeAttribute(tp.PROGRAM_END_TIME):this.setAttribute(tp.PROGRAM_END_TIME,`${e}`)}get assetStartTime(){return he(this.getAttribute(tp.ASSET_START_TIME))}set assetStartTime(e){null==e?this.removeAttribute(tp.ASSET_START_TIME):this.setAttribute(tp.ASSET_START_TIME,`${e}`)}get assetEndTime(){return he(this.getAttribute(tp.ASSET_END_TIME))}set assetEndTime(e){null==e?this.removeAttribute(tp.ASSET_END_TIME):this.setAttribute(tp.ASSET_END_TIME,`${e}`)}get extraSourceParams(){return this.hasAttribute(h$.EXTRA_SOURCE_PARAMS)?[...new URLSearchParams(this.getAttribute(h$.EXTRA_SOURCE_PARAMS)).entries()].reduce((e,[t,i])=>(e[t]=i,e),{}):h7}set extraSourceParams(e){null==e?this.removeAttribute(h$.EXTRA_SOURCE_PARAMS):this.setAttribute(h$.EXTRA_SOURCE_PARAMS,new URLSearchParams(e).toString())}get customDomain(){var e;return null!=(e=this.getAttribute(tp.CUSTOM_DOMAIN))?e:void 0}set customDomain(e){e!==this.customDomain&&(e?this.setAttribute(tp.CUSTOM_DOMAIN,e):this.removeAttribute(tp.CUSTOM_DOMAIN))}get envKey(){var e;return null!=(e=ct(this,tp.ENV_KEY))?e:void 0}set envKey(e){this.setAttribute(tp.ENV_KEY,`${e}`)}get noVolumePref(){return this.hasAttribute(h$.NO_VOLUME_PREF)}set noVolumePref(e){e?this.setAttribute(h$.NO_VOLUME_PREF,""):this.removeAttribute(h$.NO_VOLUME_PREF)}get noMutedPref(){return this.hasAttribute(h$.NO_MUTED_PREF)}set noMutedPref(e){e?this.setAttribute(h$.NO_MUTED_PREF,""):this.removeAttribute(h$.NO_MUTED_PREF)}get debug(){return null!=ct(this,tp.DEBUG)}set debug(e){e?this.setAttribute(tp.DEBUG,""):this.removeAttribute(tp.DEBUG)}get disableTracking(){return null!=ct(this,tp.DISABLE_TRACKING)}set disableTracking(e){this.toggleAttribute(tp.DISABLE_TRACKING,!!e)}get disableCookies(){return null!=ct(this,tp.DISABLE_COOKIES)}set disableCookies(e){e?this.setAttribute(tp.DISABLE_COOKIES,""):this.removeAttribute(tp.DISABLE_COOKIES)}get streamType(){var e,t,i;return null!=(i=null!=(t=this.getAttribute(tp.STREAM_TYPE))?t:null==(e=this.media)?void 0:e.streamType)?i:m.UNKNOWN}set streamType(e){this.setAttribute(tp.STREAM_TYPE,`${e}`)}get defaultStreamType(){var e,t,i;return null!=(i=null!=(t=this.getAttribute(h$.DEFAULT_STREAM_TYPE))?t:null==(e=this.mediaController)?void 0:e.getAttribute(h$.DEFAULT_STREAM_TYPE))?i:m.ON_DEMAND}set defaultStreamType(e){e?this.setAttribute(h$.DEFAULT_STREAM_TYPE,e):this.removeAttribute(h$.DEFAULT_STREAM_TYPE)}get targetLiveWindow(){var e,t;return this.hasAttribute(h$.TARGET_LIVE_WINDOW)?+this.getAttribute(h$.TARGET_LIVE_WINDOW):null!=(t=null==(e=this.media)?void 0:e.targetLiveWindow)?t:NaN}set targetLiveWindow(e){e==this.targetLiveWindow||Number.isNaN(e)&&Number.isNaN(this.targetLiveWindow)||(null==e?this.removeAttribute(h$.TARGET_LIVE_WINDOW):this.setAttribute(h$.TARGET_LIVE_WINDOW,`${+e}`))}get liveEdgeStart(){var e;return null==(e=this.media)?void 0:e.liveEdgeStart}get startTime(){return he(ct(this,tp.START_TIME))}set startTime(e){this.setAttribute(tp.START_TIME,`${e}`)}get preferPlayback(){let e=this.getAttribute(tp.PREFER_PLAYBACK);if(e===h.MSE||e===h.NATIVE)return e}set preferPlayback(e){e!==this.preferPlayback&&(e===h.MSE||e===h.NATIVE?this.setAttribute(tp.PREFER_PLAYBACK,e):this.removeAttribute(tp.PREFER_PLAYBACK))}get metadata(){var e;return null==(e=this.media)?void 0:e.metadata}set metadata(e){(oz(this,hZ,hQ).call(this),this.media)?this.media.metadata={...hV(this),...e}:hc("underlying media element missing when trying to set metadata. metadata will not be set.")}get _hlsConfig(){var e;return null==(e=this.media)?void 0:e._hlsConfig}set _hlsConfig(e){(oz(this,hZ,hQ).call(this),this.media)?this.media._hlsConfig=e:hc("underlying media element missing when trying to set _hlsConfig. _hlsConfig will not be set.")}async addCuePoints(e){var t;return(oz(this,hZ,hQ).call(this),this.media)?null==(t=this.media)?void 0:t.addCuePoints(e):void hc("underlying media element missing when trying to addCuePoints. cuePoints will not be added.")}get activeCuePoint(){var e;return null==(e=this.media)?void 0:e.activeCuePoint}get cuePoints(){var e,t;return null!=(t=null==(e=this.media)?void 0:e.cuePoints)?t:[]}addChapters(e){var t;return(oz(this,hZ,hQ).call(this),this.media)?null==(t=this.media)?void 0:t.addChapters(e):void hc("underlying media element missing when trying to addChapters. chapters will not be added.")}get activeChapter(){var e;return null==(e=this.media)?void 0:e.activeChapter}get chapters(){var e,t;return null!=(t=null==(e=this.media)?void 0:e.chapters)?t:[]}getStartDate(){var e;return null==(e=this.media)?void 0:e.getStartDate()}get currentPdt(){var e;return null==(e=this.media)?void 0:e.currentPdt}get tokens(){let e=this.getAttribute(h$.PLAYBACK_TOKEN),t=this.getAttribute(h$.DRM_TOKEN),i=this.getAttribute(h$.THUMBNAIL_TOKEN),a=this.getAttribute(h$.STORYBOARD_TOKEN);return{...oj(this,hY),...null!=e?{playback:e}:{},...null!=t?{drm:t}:{},...null!=i?{thumbnail:i}:{},...null!=a?{storyboard:a}:{}}}set tokens(e){oQ(this,hY,null!=e?e:{})}get playbackToken(){var e;return null!=(e=this.getAttribute(h$.PLAYBACK_TOKEN))?e:void 0}set playbackToken(e){this.setAttribute(h$.PLAYBACK_TOKEN,`${e}`)}get drmToken(){var e;return null!=(e=this.getAttribute(h$.DRM_TOKEN))?e:void 0}set drmToken(e){this.setAttribute(h$.DRM_TOKEN,`${e}`)}get thumbnailToken(){var e;return null!=(e=this.getAttribute(h$.THUMBNAIL_TOKEN))?e:void 0}set thumbnailToken(e){this.setAttribute(h$.THUMBNAIL_TOKEN,`${e}`)}get storyboardToken(){var e;return null!=(e=this.getAttribute(h$.STORYBOARD_TOKEN))?e:void 0}set storyboardToken(e){this.setAttribute(h$.STORYBOARD_TOKEN,`${e}`)}addTextTrack(e,t,i,a){var r;let n=null==(r=this.media)?void 0:r.nativeEl;if(n)return P(n,e,t,i,a)}removeTextTrack(e){var t;let i=null==(t=this.media)?void 0:t.nativeEl;if(i)return U(i,e)}get textTracks(){var e;return null==(e=this.media)?void 0:e.textTracks}get castReceiver(){var e;return null!=(e=this.getAttribute(h$.CAST_RECEIVER))?e:void 0}set castReceiver(e){e!==this.castReceiver&&(e?this.setAttribute(h$.CAST_RECEIVER,e):this.removeAttribute(h$.CAST_RECEIVER))}get castCustomData(){var e;return null==(e=this.media)?void 0:e.castCustomData}set castCustomData(e){this.media?this.media.castCustomData=e:hc("underlying media element missing when trying to set castCustomData. castCustomData will not be set.")}get noTooltips(){return this.hasAttribute(h$.NO_TOOLTIPS)}set noTooltips(e){e?this.setAttribute(h$.NO_TOOLTIPS,""):this.removeAttribute(h$.NO_TOOLTIPS)}get proudlyDisplayMuxBadge(){return this.hasAttribute(h$.PROUDLY_DISPLAY_MUX_BADGE)}set proudlyDisplayMuxBadge(e){e?this.setAttribute(h$.PROUDLY_DISPLAY_MUX_BADGE,""):this.removeAttribute(h$.PROUDLY_DISPLAY_MUX_BADGE)}};function ct(e,t){return e.media?e.media.getAttribute(t):e.getAttribute(t)}hK=new WeakMap,hF=new WeakMap,hY=new WeakMap,hG=new WeakMap,hq=new WeakMap,hj=new WeakMap,hZ=new WeakSet,hQ=function(){var e,t,i,a;if(!oj(this,hF)){oQ(this,hF,!0),oz(this,hZ,hJ).call(this);try{if(customElements.upgrade(this.mediaTheme),!(this.mediaTheme instanceof m9.HTMLElement))throw""}catch{hc("<media-theme> failed to upgrade!")}try{customElements.upgrade(this.media)}catch{hc("underlying media element failed to upgrade!")}try{if(customElements.upgrade(this.mediaController),!(this.mediaController instanceof a2))throw""}catch{hc("<media-controller> failed to upgrade!")}oz(this,hZ,h0).call(this),oz(this,hZ,h1).call(this),oz(this,hZ,h2).call(this),oQ(this,hG,null==(t=null==(e=this.mediaController)?void 0:e.hasAttribute(iQ))||t),oz(this,hZ,h3).call(this),null==(i=this.media)||i.addEventListener("streamtypechange",()=>oz(this,hZ,hJ).call(this)),null==(a=this.media)||a.addEventListener("loadstart",()=>oz(this,hZ,hJ).call(this))}},hz=function(){var e,t;try{null==(e=null==window?void 0:window.CSS)||e.registerProperty({name:"--media-primary-color",syntax:"<color>",inherits:!0}),null==(t=null==window?void 0:window.CSS)||t.registerProperty({name:"--media-secondary-color",syntax:"<color>",inherits:!0})}catch{}},hX=function(e){Object.assign(oj(this,hj),e),oz(this,hZ,hJ).call(this)},hJ=function(e={}){var t,i,a,r,n,s,o,l,d,u,h,c,p,v,b,E,g,f,A,y,T,k,_,w,I,R,C,S,M,L,D,x,N,O,P,U,W,$,B,H,V,K,F,Y,G,q,j;let Z,Q,z,X;t={...oj(this,hj),...e},Z={src:!this.playbackId&&this.src,playbackId:this.playbackId,hasSrc:!!this.playbackId||!!this.src||!!this.currentSrc,poster:this.poster,storyboard:(null==(i=this.media)?void 0:i.currentSrc)&&this.storyboard,storyboardSrc:this.getAttribute(h$.STORYBOARD_SRC),fullscreenElement:this.getAttribute(h$.FULLSCREEN_ELEMENT),placeholder:this.getAttribute("placeholder"),themeTemplate:function(e){var t,i;let a=e.theme;if(a){let r=null==(i=null==(t=e.getRootNode())?void 0:t.getElementById)?void 0:i.call(t,a);if(r&&r instanceof HTMLTemplateElement)return r;a.startsWith("media-theme-")||(a=`media-theme-${a}`);let n=m9.customElements.get(a);if(null!=n&&n.template)return n.template}}(this),thumbnailTime:!this.tokens.thumbnail&&this.thumbnailTime,autoplay:this.autoplay,crossOrigin:this.crossOrigin,loop:this.loop,noHotKeys:this.hasAttribute(h$.NOHOTKEYS),hotKeys:this.getAttribute(h$.HOTKEYS),muted:this.muted,paused:this.paused,preload:this.preload,envKey:this.envKey,preferCmcd:this.preferCmcd,debug:this.debug,disableTracking:this.disableTracking,disableCookies:this.disableCookies,tokens:this.tokens,beaconCollectionDomain:this.beaconCollectionDomain,maxResolution:this.maxResolution,minResolution:this.minResolution,maxAutoResolution:this.maxAutoResolution,programStartTime:this.programStartTime,programEndTime:this.programEndTime,assetStartTime:this.assetStartTime,assetEndTime:this.assetEndTime,renditionOrder:this.renditionOrder,metadata:this.metadata,playerInitTime:this.playerInitTime,playerSoftwareName:this.playerSoftwareName,playerSoftwareVersion:this.playerSoftwareVersion,startTime:this.startTime,preferPlayback:this.preferPlayback,audio:this.audio,defaultStreamType:this.defaultStreamType,targetLiveWindow:this.getAttribute(tp.TARGET_LIVE_WINDOW),streamType:hl(this.getAttribute(tp.STREAM_TYPE)),primaryColor:this.getAttribute(h$.PRIMARY_COLOR),secondaryColor:this.getAttribute(h$.SECONDARY_COLOR),accentColor:this.getAttribute(h$.ACCENT_COLOR),forwardSeekOffset:this.forwardSeekOffset,backwardSeekOffset:this.backwardSeekOffset,defaultHiddenCaptions:this.defaultHiddenCaptions,defaultDuration:this.defaultDuration,defaultShowRemainingTime:this.defaultShowRemainingTime,hideDuration:(Q=null==(n=this.mediaController)?void 0:n.querySelector("media-time-display"))&&"none"===getComputedStyle(Q).getPropertyValue("--media-duration-display-display").trim(),playbackRates:this.getAttribute(h$.PLAYBACK_RATES),customDomain:null!=(a=this.getAttribute(tp.CUSTOM_DOMAIN))?a:void 0,title:this.getAttribute(h$.TITLE),videoTitle:null!=(r=this.getAttribute(h$.VIDEO_TITLE))?r:this.getAttribute(h$.TITLE),novolumepref:this.hasAttribute(h$.NO_VOLUME_PREF),nomutedpref:this.hasAttribute(h$.NO_MUTED_PREF),proudlyDisplayMuxBadge:this.hasAttribute(h$.PROUDLY_DISPLAY_MUX_BADGE),castReceiver:this.castReceiver,disablePseudoEnded:this.hasAttribute(h$.DISABLE_PSEUDO_ENDED),...t,extraSourceParams:this.extraSourceParams},s=hS`
  <style>
    ${(e=>{let{tokens:t}=e;return t.drm?":host(:not([cast-receiver])) { --_cast-button-drm-display: none; }":""})(Z)}
    ${hy}
  </style>
  ${l=Z,hS`
  <media-theme
    template="${l.themeTemplate||!1}"
    defaultstreamtype="${null!=(d=l.defaultStreamType)&&d}"
    hotkeys="${z=l.hotKeys?`${l.hotKeys}`:"","live"===hl(l.streamType)&&(z+=" noarrowleft noarrowright"),z||!1}"
    nohotkeys="${l.noHotKeys||!l.hasSrc||!1}"
    noautoseektolive="${!!(null!=(u=l.streamType)&&u.includes(m.LIVE))&&0!==l.targetLiveWindow}"
    novolumepref="${l.novolumepref||!1}"
    nomutedpref="${l.nomutedpref||!1}"
    disabled="${!l.hasSrc||l.isDialogOpen}"
    audio="${null!=(h=l.audio)&&h}"
    style="${null!=(j={"--media-primary-color":l.primaryColor,"--media-secondary-color":l.secondaryColor,"--media-accent-color":l.accentColor},X="",Object.entries(j).forEach(([e,t])=>{null!=t&&(X+=`${m6(e)}: ${t}; `)}),c=X?X.trim():void 0)&&c}"
    defaultsubtitles="${!l.defaultHiddenCaptions}"
    forwardseekoffset="${null!=(p=l.forwardSeekOffset)&&p}"
    backwardseekoffset="${null!=(v=l.backwardSeekOffset)&&v}"
    playbackrates="${null!=(b=l.playbackRates)&&b}"
    defaultshowremainingtime="${null!=(E=l.defaultShowRemainingTime)&&E}"
    defaultduration="${null!=(g=l.defaultDuration)&&g}"
    hideduration="${null!=(f=l.hideDuration)&&f}"
    title="${null!=(A=l.title)&&A}"
    videotitle="${null!=(y=l.videoTitle)&&y}"
    proudlydisplaymuxbadge="${null!=(T=l.proudlyDisplayMuxBadge)&&T}"
    exportparts="${hM}"
    onclose="${l.onCloseErrorDialog}"
    onfocusin="${l.onFocusInErrorDialog}"
  >
    <mux-video
      slot="media"
      inert="${null!=(k=l.noHotKeys)&&k}"
      target-live-window="${null!=(_=l.targetLiveWindow)&&_}"
      stream-type="${null!=(w=hl(l.streamType))&&w}"
      crossorigin="${null!=(I=l.crossOrigin)?I:""}"
      playsinline
      autoplay="${null!=(R=l.autoplay)&&R}"
      muted="${null!=(C=l.muted)&&C}"
      loop="${null!=(S=l.loop)&&S}"
      preload="${null!=(M=l.preload)&&M}"
      debug="${null!=(L=l.debug)&&L}"
      prefer-cmcd="${null!=(D=l.preferCmcd)&&D}"
      disable-tracking="${null!=(x=l.disableTracking)&&x}"
      disable-cookies="${null!=(N=l.disableCookies)&&N}"
      prefer-playback="${null!=(O=l.preferPlayback)&&O}"
      start-time="${null!=l.startTime&&l.startTime}"
      beacon-collection-domain="${null!=(P=l.beaconCollectionDomain)&&P}"
      player-init-time="${null!=(U=l.playerInitTime)&&U}"
      player-software-name="${null!=(W=l.playerSoftwareName)&&W}"
      player-software-version="${null!=($=l.playerSoftwareVersion)&&$}"
      env-key="${null!=(B=l.envKey)&&B}"
      custom-domain="${null!=(H=l.customDomain)&&H}"
      src="${l.src?l.src:!!l.playbackId&&eI(l)}"
      cast-src="${l.src?l.src:!!l.playbackId&&eI(l)}"
      cast-receiver="${null!=(V=l.castReceiver)&&V}"
      drm-token="${null!=(F=null==(K=l.tokens)?void 0:K.drm)&&F}"
      exportparts="video"
      disable-pseudo-ended="${null!=(Y=l.disablePseudoEnded)&&Y}"
      max-auto-resolution="${null!=(G=l.maxAutoResolution)&&G}"
    >
      ${l.storyboard?hS`<track label="thumbnails" default kind="metadata" src="${l.storyboard}" />`:hS``}
      <slot></slot>
    </mux-video>
    <slot name="poster" slot="poster">
      <media-poster-image
        part="poster"
        exportparts="poster, img"
        src="${!!l.poster&&l.poster}"
        placeholdersrc="${null!=(q=l.placeholder)&&q}"
      ></media-poster-image>
    </slot>
  </media-theme>
`}
`,o=this.shadowRoot,s.renderInto(o)},h0=function(){let e=e=>{var t,i;if(!(null!=e&&e.startsWith("theme-")))return;let a=e.replace(/^theme-/,"");if(hB.includes(a))return;let r=this.getAttribute(e);null!=r?null==(t=this.mediaTheme)||t.setAttribute(a,r):null==(i=this.mediaTheme)||i.removeAttribute(a)};new MutationObserver(t=>{for(let{attributeName:i}of t)e(i)}).observe(this,{attributes:!0}),this.getAttributeNames().forEach(e)},h1=function(){let e=e=>{var t;let i=null==(t=this.media)?void 0:t.error;if(!(i instanceof l)){let{message:e,code:t}=null!=i?i:{};i=new l(e,t)}if(!(null!=i&&i.fatal)){hh(i),i.data&&hh(`${i.name} data:`,i.data);return}let a=hD(i,!1);a.message&&hp(a),hc(i),i.data&&hc(`${i.name} data:`,i.data),oz(this,hZ,hX).call(this,{isDialogOpen:!0})};this.addEventListener("error",e),this.media&&(this.media.errorTranslator=(e={})=>{var t,i,a;if(!((null==(t=this.media)?void 0:t.error)instanceof l))return e;let r=hD(null==(i=this.media)?void 0:i.error,!1);return{player_error_code:null==(a=this.media)?void 0:a.error.code,player_error_message:r.message?String(r.message):e.player_error_message,player_error_context:r.context?String(r.context):e.player_error_context}})},h2=function(){var e,t,i,a;let r=()=>oz(this,hZ,hJ).call(this);null==(t=null==(e=this.media)?void 0:e.textTracks)||t.addEventListener("addtrack",r),null==(a=null==(i=this.media)?void 0:i.textTracks)||a.addEventListener("removetrack",r)},h3=function(){var e,t;if(!/Firefox/i.test(navigator.userAgent))return;let i,a=new WeakMap,r=()=>this.streamType===m.LIVE&&!this.secondaryColor&&this.offsetWidth>=800,n=(e,t,i=!1)=>{r()||Array.from(e&&e.activeCues||[]).forEach(e=>{if(!(!e.snapToLines||e.line<-5||e.line>=0&&e.line<10))if(!t||this.paused){let t=e.text.split(`
`).length,r=-3;this.streamType===m.LIVE&&(r=-2);let n=r-t;if(e.line===n&&!i)return;a.has(e)||a.set(e,e.line),e.line=n}else setTimeout(()=>{e.line=a.get(e)||"auto"},500)})},s=()=>{var e,t;n(i,null!=(t=null==(e=this.mediaController)?void 0:e.hasAttribute(iQ))&&t)},o=()=>{var e,t;let a=Array.from((null==(t=null==(e=this.mediaController)?void 0:e.media)?void 0:t.textTracks)||[]).filter(e=>["subtitles","captions"].includes(e.kind)&&"showing"===e.mode)[0];a!==i&&(null==i||i.removeEventListener("cuechange",s)),null==(i=a)||i.addEventListener("cuechange",s),n(i,oj(this,hG))};o(),null==(e=this.textTracks)||e.addEventListener("change",o),null==(t=this.textTracks)||t.addEventListener("addtrack",o),this.addEventListener("userinactivechange",()=>{var e,t;let a=null==(t=null==(e=this.mediaController)?void 0:e.hasAttribute(iQ))||t;oj(this,hG)!==a&&(oQ(this,hG,a),n(i,oj(this,hG)))})},e.s(["default",()=>ce,"getVideoAttribute",()=>ct,"playerSoftwareName",()=>h8,"playerSoftwareVersion",()=>ho],606552);var ci=e=>{throw TypeError(e)},ca=(e,t,i)=>t.has(e)||ci("Cannot "+i),cr=class{addEventListener(){}removeEventListener(){}dispatchEvent(e){return!0}};"u"<typeof DocumentFragment&&(globalThis.DocumentFragment=class extends cr{});var cn,cs=class extends cr{},co=class{constructor(e,t={}){((e,t,i)=>t.has(e)?ci("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,i))(this,cn),((e,t,i,a)=>(ca(e,t,"write to private field"),a?a.call(e,i):t.set(e,i)))(this,cn,null==t?void 0:t.detail)}get detail(){let e,t;return ca(this,e=cn,"read from private field"),t?t.call(this):e.get(this)}initCustomEvent(){}};cn=new WeakMap;var cl={document:{createElement:function(e,t){return new cs}},DocumentFragment,customElements:{get(e){},define(e,t,i){},getName:e=>null,upgrade(e){},whenDefined:e=>Promise.resolve(cs)},CustomEvent:co,EventTarget:cr,HTMLElement:cs,HTMLVideoElement:class extends cr{}},cd="u"<typeof window||void 0===globalThis.customElements,cu=cd?cl:globalThis;cd&&cl.document,cu.customElements.get("mux-player")||(cu.customElements.define("mux-player",ce),cu.MuxPlayerElement=ce),e.s([],831818),e.i(606552),e.s(["MediaError",()=>l],612160)}]);