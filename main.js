window.onload = function () {
  const id = window.localStorage.getItem("id")
    ? window.localStorage.getItem("id")
    : prompt("直播间号");
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
  const cut = document.querySelector('.cut')
  let flag = true
  cut.addEventListener('click', () => {
    if (flag) {
      document.body.style.background = '#232427'
      cut.innerText = '开灯'
    } else {
      document.body.style.background = '#F2F5F6'
      cut.innerText = '关灯'
    }
    flag=!flag
  })
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
    if (window.screen.availHeight * 2 < duoyu.length * 25) {
      for (
        let i = Number.parseInt(window.screen.availHeight / 25);
        duoyu.length > i;
        i--
      ) {
        list.removeChild(duoyu[i]);
      }
    }
    list.innerHTML += `
    <div class="duoyu">

    <div class="danm" style="background:${blColor(res.bl)};display:${
      res.bl == 0 || res.bl == "" ? "none" : "block"
    }">
      <span style='font-size:12px;background:transparent;'>${res.bl}</span>${
      res.bnn
    }
    </div>

    <div class="level" style="background:${levelColor(res.level)}">
      lv.${res.level < 10 ? "0" + res.level : res.level} </div>
      
        <div class="user">
          ${res.nn}:
        </div>
        <div class="text" style="color:${textColor(res.bl)}">
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
    console.log(res);
    list.innerHTML += `
    <div class="duoyu" style='margin: 20px 0'>

    <div class="danm" style="background:${blColor(res.bl)};display:${
      res.bl == 0 || res.bl == "" || !res.bl ? "none" : "block"
    }">
      <span style='font-size:12px;background:transparent;'>${res.bl}</span>${
      res.bnn
    }
    </div>

    <div class="level" style="background:${levelColor(res.level)}">
      lv.${res.level < 10 ? "0" + res.level : res.level} </div>
        <div class="user">
          ${res.nn} 进入直播间
        </div>
    </div>
    `;
    console.log("[uenter]", `${res.nn}进入房间`);
  });
  //开始监听
  room.run();

  //导出日志(不传入房间号默认为所有)
  room.logger.export(id);

  //清除日志(不传入房间号默认为所有)
  room.logger.clear(id);
  function blColor(n) {
    if (n <= 5) return "#21B8FC";
    if (n <= 10) return "#25D8E6";
    if (n <= 15) return "#FDAA29";
    if (n <= 20) return "#FD6E21";
    if (n <= 25) return "#EC1A20";
    if (n <= 30) return "#BE29E6";
    return '#D86EFE'
  }
  function textColor(n) {
    if (n <= 5) return "#777777";
    if (n <= 8) return "#2887EA";
    if (n <= 11) return "#7CC752";
    if (n <= 14) return "#FD6CB4";
    if (n <= 17) return "#FD7F24";
    if (n <= 20) return "#BE29E6";
    if (n <= 30) return "#FC0D1C";
    return 'FC0D1C'
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
};
