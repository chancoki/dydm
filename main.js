window.onload = function () {
  let flag = true;
  const roomEle = document.querySelector(".room");
  let msgNum = 0
  const msg = document.querySelector('.msg')
  const id = window.localStorage.getItem("id")
    ? window.localStorage.getItem("id")
    : prompt("直播间号");
  const cut = document.querySelector(".cut");
  const ligth = window.localStorage.getItem("ligth")
    ? JSON.parse(window.localStorage.getItem("ligth"))
    : { color: "#F2F5F6", title: "关灯" };
  document.body.style.background = ligth.color;
  cut.innerText = ligth.title;
  flag = "#F2F5F6" == ligth.color;

  window.localStorage.setItem("id", id);
  const list = document.querySelector(".list");
  const bt = document.querySelector(".bt");
  bt.addEventListener("click", () => {
    const rid = prompt("直播间号");
    if (rid) {
      window.localStorage.setItem("id", rid);
      location.reload();
    }
  });


  cut.addEventListener("click", () => {
    if (flag) {
      document.body.style.background = "#232427";
      cut.innerText = "开灯";
      window.localStorage.setItem(
        "ligth",
        JSON.stringify({ color: "#232427", title: "开灯" })
      );
    } else {
      document.body.style.background = "#F2F5F6";
      cut.innerText = "关灯";
      window.localStorage.setItem(
        "ligth",
        JSON.stringify({ color: "#F2F5F6", title: "关灯" })
      );
    }
    flag = !flag;
  });
  document.title = id + "_直播间";
  var room = new danmaku(id, {
    debug: false, //存储到indexedDB
  });
  //系统事件
  room.on("connect", function () {
    roomEle.style.display = "block";
    roomEle.innerHTML = "连接完成";
  });
  room.on("disconnect", function () {
    console.log("[disconnect] roomId=%s", this.roomId);
  });
  room.on("error", function (err) {
    roomEle.style.display = "block";
    roomEle.innerHTML = "出现错误";
  });
  room.on("loginres", function (res) {
    roomEle.style.display = "block";
    roomEle.innerHTML = id;
    console.log(res)
  });


  //消息事件
  let scrollFlag = true;
  room.on("chatmsg", function (res) {
    scrollTime();
    if (scrollFlag) list.scrollTo(0, list.scrollHeight);
    
    if (list.children.length > 150) list.removeChild(list.children[0]);
    const div = document.createElement("div");
    div.className = "duoyu";
    div.innerHTML = `
    <div class="level" style="background:${blColor(res.bl)};"><i>lv.</i>${
      res.level < 10 ? "0" + res.level : res.level
    }</div>${
      res.bl == 0 || res.bl == "" || !res.bl
        ? ""
        : `<div class="danm" style="background:${blColor(res.bl)};"><span style='background:transparent;'>${res.bl}</span>${res.bnn}</div>`
    }<div class="user">${res.nn}:</div>
        <div class="text" style="color:${textColor(res.bl)}">${res.txt}</div>
    `;
    list.appendChild(div);
  });
  room.on("uenter", function (res) {
    scrollTime();
    if (scrollFlag) list.scrollTo(0, list.scrollHeight);
    if (list.children.length > 150) list.removeChild(list.children[0]);
    const div = document.createElement("div");
    div.className = "duoyu";
    div.innerHTML = `
    <div class="level" style="background:${blColor(res.bl)}; "><i>lv.</i>${
      res.level < 10 ? "0" + res.level : res.level
    }</div>${
      res.bl == 0 || res.bl == "" || !res.bl
        ? ""
        : `<div class="danm" style="background:${blColor(res.bl)};">
        <span style='background:transparent;'>${res.bl}</span>${res.bnn}</div>`
    }<div class="user">${
      res.nn
    }<span style='color:#777777;margin-left: 3px;'>欢迎来到本直播间</span></div>
    `;
    list.appendChild(div);
  });
  //开始监听
  room.run();
  function blColor(n) {
    if (n <= 5) return "#21B8FC";
    if (n <= 10) return "#25D8E6";
    if (n <= 15) return "#FDAA29";
    if (n <= 20) return "#FD6E21";
    if (n <= 25) return "#EC1A20";
    if (n <= 30) return "#BE29E6";
    return "#D86EFE";
  }
  function textColor(n) {
    if (n <= 5) return "#777777";
    if (n <= 8) return "#2887EA";
    if (n <= 11) return "#7CC752";
    if (n <= 14) return "#FD6CB4";
    if (n <= 17) return "#FD7F24";
    if (n <= 20) return "#BE29E6";
    if (n <= 30) return "#FC0D1C";
    return "#FC0D1C";
  }
  function levelColor(n) {
    if (n <= 14) return "#D39753";
    if (n <= 29) return "#77DF85";
    if (n <= 39) return "#36C3F0";
    if (n <= 49) return "#3872DC";
    if (n <= 59) return "#7066FA";
    if (n <= 69) return "#762AF7";
    if (n <= 79) return "#9828C2";
    if (n <= 89) return "#EF096E";
    if (n <= 99) return "#DE011D";
    if (n <= 109) return "#FF511E";
    if (n <= 119) return "#FF8400";
    if (n <= 124) return "#FFA717";
    if (n <= 129) return "#8916F0";
    return "#C70137";
  }
  function scrollTime() {
    const scrollTop = list.scrollHeight - list.scrollTop;
    const clientH = document.documentElement.clientHeight;
    if (scrollTop <= clientH + clientH / 8) {
      scrollFlag = true;
      msg.style.display = 'none'
      msgNum = 0
    } else {
      scrollFlag = false
      msg.style.display = 'block'
      msg.children[0].innerHTML = ++msgNum
    }
  }
  msg.addEventListener('click', () => {
    scrollFlag = true;
    list.scrollTo(0, list.scrollHeight);
    msg.style.display = 'none'
    msgNum = 0
  })
};
