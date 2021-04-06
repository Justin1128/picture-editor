import { getOssConfig } from "@/api/oss";

let stopUp = false; //中断上传  临时方法
let xhr = null;

function random_string(len) {
  len = len || 32;
  var chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
  var maxPos = chars.length;
  var pwd = "";
  for (let i = 0; i < len; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}
function get_suffix(filename) {
  let pos = filename.lastIndexOf(".");
  let suffix = "";
  if (pos != -1) {
    suffix = filename.substring(pos);
  }
  return suffix;
}
function getFileType(name) {
  if (!name) return false;
  var imgType = ["gif", "jpeg", "jpg", "bmp", "png"];
  var videoType = [
    "avi",
    "wmv",
    "mkv",
    "mp4",
    "mov",
    "rm",
    "3gp",
    "flv",
    "mpg",
    "rmvb"
  ];
  if (RegExp(".(" + imgType.join("|") + ")$", "i").test(name.toLowerCase())) {
    return "image";
  } else if (
    RegExp(".(" + videoType.join("|") + ")$", "i").test(name.toLowerCase())
  ) {
    return "video";
  } else {
    return false;
  }
}
function progressFunction(event) {
  console.log(stopUp, "---------stopUp");
  if (stopUp) {
    xhr.abort();
  }
  // 设置进度显示
  if (event.lengthComputable) {
    var percent = Math.floor(event.loaded / event.total * 100);
    if (percent > 100) {
      percent = 100;
    }
  }
  return percent;
}
/**
 * callback--是否上传成功及成功url
 * type:again：开始上传/success：成功  fileType:文件类型
 */
let uploadImgArr = [];

/**
 * 
 * @param {*} file --入参   原生input 类型  e.target.files  不是数组  伪数组(对象类型key为index)
 * @param {*} callback--一组上传全部成功回调  返回值有：类型(again:开始上传、success：上传成功)、文件相对地址及绝对地址、进度默认100
 * 
 * TODO:客户端使用时可将callback回调参数与每组合并成已上传的总数组
 */
export function _ossDT(file, callback) {
  stopUp = false;
  uploadImgArr = [];
  let fileList = file;
  let pro = new Promise((resolve, rej) => {
    // 判断签名有没有过期
    var res = JSON.parse(localStorage.getItem("sign"));
    var timestamp = Date.parse(new Date()) / 1000;
    if (res && res.expire - 3 > timestamp) {
      resolve(res);
    } else {
      // 时效性问题需要重新调接口查询配置
      // getOssConfig().then(res => {
      //   localStorage.setItem("sign", JSON.stringify(res.data));
      //   resolve(res.data);
      // });
    }
  }).then(success => {
    var data = success;
    Object.values(fileList).forEach((item, index) => {
      uploadImgArr.push({
        info: upFile(item, data)
      });
    });
    callback(uploadImgArr);
  });
}
function upFile(item, data) {
  let filename = item.name;
  let picName = random_string(10) + get_suffix(filename);
  let keyValue = data.dir + picName;
  let ossData = new FormData();
  ossData.append("name", item.name);
  //key就代表文件层级和阿里云上的文件名
  ossData.append("key", keyValue);
  ossData.append("policy", data.policy);
  ossData.append("OSSAccessKeyId", data.accessid);
  ossData.append("success_action_status", 200);
  ossData.append("signature", data.signature);
  ossData.append("file", item, item.name);
  let val = {
    type: "conduct",
    res: {},
    progress: 0
  };
  try {
    xhr = new XMLHttpRequest();
    xhr.open("post", data.host, true);
    xhr.upload.addEventListener(
      "progress",
      e => {
        val.progress = progressFunction(e);
      },
      false
    ); //调用方法监听上传进度
    xhr.onload = () => {
      let url = data.host + "/" + keyValue;
      let url2 = "/" + keyValue;
      // uploadImgArr[index] = {
      //   type: "success",
      //   res: {
      //     fileType: getFileType(url),
      //     absoluteUrl: url,
      //     relativeUrl: url2
      //   },
      //   progress: 100
      // };
      val.type = "success";
      val.res = {
        fileType: getFileType(url),
        absoluteUrl: url,
        relativeUrl: url2
      };

      val.progress = 100;
    };
    xhr.send(ossData);
  } catch (error) {
    callback({ type: "error", res: "" });
  }
  return val;
}
export function stopUpdate() {
  stopUp = true;
  console.log("-------123123123");
}
// export default stopUpdate
// export _ossDT
