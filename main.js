window.onload = function () {
  const id = window.localStorage.getItem("id")
    ? window.localStorage.getItem("id")
    : prompt("房间号");
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
  document.title = id + "_直播间";
  var room = new danmaku(id, {
    debug: false, //存储到indexedDB
  });
  //系统事件
  room.on("connect", function () {
    console.log("[connect] roomId=%s", this.roomId);
  });
  room.on("disconnect", function () {
    console.log("[disconnect] roomId=%s", this.roomId);
  });
  room.on("error", function (err) {
    console.log("[error] roomId=%s", this.roomId);
  });
  //消息事件
  room.on("chatmsg", function (res) {
    const duoyu = document.querySelectorAll(".duoyu");
    if (window.screen.availHeight * 2 < duoyu.length * 35) {
      for (
        let i = Number.parseInt(window.screen.availHeight / 35);
        duoyu.length > i;
        i--
      ) {
        list.removeChild(duoyu[i]);
      }
    }

    // const div = document.createElement("div");
    // div.className = "duoyu";
    list.innerHTML += `
    <div class="duoyu">
    <div class="level" style="background:${
      res.level <= 5
        ? "#21B8FC"
        : res.level <= 10
        ? "#25D8E6"
        : res.level <= 15
        ? "#FDAA29"
        : res.level <= 20
        ? "#FD6E21"
        : res.level <= 25
        ? "#EC1A20"
        : res.level <= 30
        ? "#BE29E6"
        : ""
    }">
       lv.${res.level < 10 ? "0" + res.level : res.level}
    </div>
    <div class="user">
    ${res.nn}：
    </div>
    <div class="text" style="color:${
      res.level <= 5
        ? "#FFFFFF"
        : res.level <= 8
        ? "#2887EA"
        : res.level <= 11
        ? "#7CC752"
        : res.level <= 14
        ? "#FD6CB4"
        : res.level <= 17
        ? "#FD7F24"
        : res.level <= 20
        ? "#9A44F0"
        : res.level <= 30
        ? "#FC0D1C"
        : ""
    }">
    ${res.txt}
    </div>
    </div>

    `;
    // list.appendChild(div);
  });
  room.on("loginres", function (res) {
    console.log("[loginres]", "登录成功");
  });
  room.on("uenter", function (res) {
    list.innerHTML += `
    <div class="duoyu" style='margin: 20px 0'>
    <div class="level" style="background:${
      res.level <= 5
        ? "#21B8FC"
        : res.level <= 10
        ? "#25D8E6"
        : res.level <= 15
        ? "#FDAA29"
        : res.level <= 20
        ? "#FD6E21"
        : res.level <= 25
        ? "#EC1A20"
        : res.level <= 30
        ? "#BE29E6"
        : ""
    }">
       lv.${res.level < 10 ? "0" + res.level : res.level}
    </div>
    <div class="user">
    ${res.nn} 进入直播间
    </div>
    `;
    console.log("[uenter]", `${res.nn}进入房间`);
  });
  //开始监听
  room.run();

  //导出日志(不传入房间号默认为所有)
  room.logger.export(房间号);

  //清除日志(不传入房间号默认为所有)
  room.logger.clear(房间号);
};
