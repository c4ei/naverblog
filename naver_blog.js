/*
cd /home/dev/www/craw/naverblog/
node naver_blog.js
*/
//#################
const _AndroidYN = "N";
let puppeteer;
if (_AndroidYN == "N") {
  puppeteer = require("puppeteer");
} else {
  puppeteer = require("puppeteer-core");
}
//#################
const { exec } = require("child_process");
const cheerio = require("cheerio");
const fakeUa = require("fake-useragent");

// const _prod_id = "7420152304";
// const _mainUrl = "https://m.naver.com";
const _gotoUrl1 = "https://www.threads.net/@c4ei_net/post/C6ym_cLBoKS";
const _gotoUrl2 = "https://m.blog.naver.com/aahcoin/223442940171";

let _loopCnt = 0;
let _mainProcessRunYN = "N";
let arr_useIP = ["122.35.243.20"];
// let arr_useIP = [""];

async function jsfn_getHTML(_proxyUrl, proxy_useYN) {
  console.log(getCurTimestamp() + "#jsfn_getHTML - start");
  let browser; // 브라우저 1개만 띄우기 위해

  (async () => {
    _mainProcessRunYN = "Y";
    // console.log("[proxy_useYN : " +proxy_useYN +" / "+_proxyUrl +":_proxyUrl - jsfn_getHTML]");
    let _arg = "";
    if (proxy_useYN == "Y") {
      _arg = "'--proxy-server=" + _proxyUrl + "',";
    }

    if (_AndroidYN == "N") {
      //브라우저 1개만 띄우기 위해
      if (!browser)
        browser = await puppeteer.launch({
          // headless: true , // NO SHOW
          headless: false, // SHOW
          args: [
            "--window-size=1080,800",
            "--disable-notifications",
            "--incognito",
            _arg,
          ],
          // '--incognito', // 크롬 시크릿모드
        });
    } else {
      //--> 안드로이드 테스트 시
      if (!browser)
        browser = await puppeteer.launch({
          headless: true, // NO SHOW
          executablePath: "/usr/bin/chromium-browser",
          args: [
            "--disable-gpu",
            "--disable-setuid-sandbox",
            "--no-sandbox",
            "--no-zygote",
          ],
        });
    }

    const page = await browser.newPage();
    let _fakeUa = fakeUa();
    await browser.userAgent(_fakeUa);
    // console.log("_fakeUa : "+_fakeUa);
    await page.goto(
      _gotoUrl1,
      { waitUntil: "networkidle2" } // #콘텐츠 로딩 문제 처리
      // load- 로드 이벤트가 발생하면 탐색이 완료됩니 다.
      // domcontentloaded- DOMContentLoaded 이벤트가  시작되면 탐색이 완료됩니다.
      // networkidle0- 최소 500ms 동안 네트워크 연결이 0개 이하일 때 탐색이 종료됩니다.
      // networkidle2- 최소 500ms 동안 네트워크 연결이 2개 이하일 때 탐색이 종료됩니다.
      // #올바른 waitUntil 옵션 선택
      // networkidle0SPA 기반 애플리케이션이나 가져오 기 요청을 사용하는 애플리케이션과 같이 완료되면 연결을  닫는 애플리케이션에 가장 적합합니다.
      // networkidle2폴링이나 네트워크 연결과 관련된  백그라운드 작업과 같이 스트림이나 수명이 긴 연결을 사용 하는 페이지에 이상적입니다.
    );
    await page.waitForSelector("body");

    await page.evaluate(() => {
      (() => {
        const box = document.createElement("div");
        box.classList.add("mouse-helper");
        // const styleElement = document.createElement('style');
        // styleElement.innerHTML = `.mouse-helper { pointer-events: none;position: absolute;z-index: 100000;top: 0;left: 0;width: 20px;height: 20px;background: rgba(0,0,0,.4);border: 1px solid white;border-radius: 10px;margin-left: -10px;margin-top: -10px;transition: background .2s, border-radius .2s, border-color .2s;}
        //   .mouse-helper.button-1 { transition: none;background: rgba(0,0,0,0.9); }
        //   .mouse-helper.button-2 { transition: none;border-color: rgba(0,0,255,0.9); }
        //   .mouse-helper.button-3 { transition: none; border-radius: 4px;}
        //   .mouse-helper.button-4 { transition: none;border-color: rgba(255,0,0,0.9); }
        //   .mouse-helper.button-5 { transition: none; border-color: rgba(0,255,0,0.9);} `;
        // document.head.appendChild(styleElement);
        // document.body.appendChild(box);
        document.addEventListener(
          "mousemove",
          (event) => {
            box.style.left = event.pageX + "px";
            box.style.top = event.pageY + "px";
            updateButtons(event.buttons);
          },
          true
        );
        document.addEventListener(
          "mousedown",
          (event) => {
            // console.log("mousedown X:"+event.pageX + 'px' + "Y:"+event.pageY + 'px');
            updateButtons(event.buttons);
            box.classList.add("button-" + event.which);
            // alert("mousedown X:"+event.pageX + 'px' + "Y:"+event.pageY + 'px');
            console.log(
              "mousedown X:" + event.pageX + "px" + "Y:" + event.pageY + "px"
            );
          },
          true
        );
        document.addEventListener(
          "mouseup",
          (event) => {
            // console.log("mouseup X:"+event.pageX + 'px' + "Y:"+event.pageY + 'px');
            updateButtons(event.buttons);
            box.classList.remove("button-" + event.which);
          },
          true
        );
        function updateButtons(buttons) {
          for (let i = 0; i < 5; i++) {
            box.classList.toggle("button-" + i, !!(buttons & (1 << i)));
          }
        }
      })();
    });
    // 메인페이지
    await page.mouse.move(250, 251);
    await fn_wait(2, 3);
    fn_senWheel(300);
    await fn_wait(2, 5);
    await page.mouse.move(351, 236);
    await fn_wait(20, 40);
    // await page.mouse.click(351, 236, { button: "left" });
    // await fn_wait(2, 3);
    // await page.mouse.move(200, 200);

    //_gotoUrl2
    await page.goto(_gotoUrl2, { waitUntil: "networkidle2" });
    await page.waitForSelector("body");
    await page.mouse.move(250, 251);
    await fn_wait(2, 3);
    fn_senWheel(400);
    await fn_wait(2, 5);
    fn_senWheel(400);
    await fn_wait(2, 5);
    fn_senWheel(400);
    await fn_wait(2, 5);
    await page.mouse.move(351, 236);
    await fn_wait(33, 66);

    // ################### 상품 상세 페이지 end ###################
    async function fn_wait(_start, _end) {
      await new Promise((resolve) =>
        setTimeout(resolve, 1000 * getRandomInt(_start, _end))
      );
    }

    async function fn_senWheel(_heigh) {
      await page.mouse.wheel({ deltaY: _heigh });
    }

    try {
      console.log(
        (await page.evaluate("navigator.userAgent")) + " - browser.close()"
      );
      await browser.close();
    } catch (e) {
      console.log(e);
    }
    _loopCnt++;
    console.log(getCurTimestamp() + " _loopCnt : " + _loopCnt);
    _mainProcessRunYN = "N";
  })();
}

async function jsfn_getIP() {
  let browser; // 브라우저 1개만 띄우기 위해
  let _curip = "";
  let _arg = "";
  let _ip_url = "https://ip.pe.kr/";
  //브라우저 1개만 띄우기 위해
  if (_AndroidYN == "N") {
    if (!browser)
      browser = await puppeteer.launch({
        headless: true, // NO SHOW
        // headless: false , // SHOW
        args: [
          "--window-size=1080,800",
          "--disable-notifications",
          "--incognito",
          _arg,
        ], // '--incognito', // 크롬 시크릿모드
      });
  } else {
    //--> 안드로이드 테스트 시
    if (!browser)
      browser = await puppeteer.launch({
        headless: true, // NO SHOW
        executablePath: "/usr/bin/chromium-browser",
        args: [
          "--disable-gpu",
          "--disable-setuid-sandbox",
          "--no-sandbox",
          "--no-zygote",
        ],
      });
  }

  const page = await browser.newPage();
  await page.goto(_ip_url, { waitUntil: "networkidle2" });
  await page.waitForSelector("body");
  let _content = await page.content();
  await page.waitForSelector(
    "body > div.cover-container.d-flex.p-3.flex-column > div.inner.cover.text-center > h1"
  );
  _curip = await page.evaluate(
    () =>
      document.querySelector(
        "body > div.cover-container.d-flex.p-3.flex-column > div.inner.cover.text-center > h1"
      ).textContent
  );
  // console.log("####################################################");
  // console.log("현재 IP : "+_curip);
  // console.log("####################################################");
  // await new Promise(resolve => setTimeout(resolve, 1000*getRandomInt(4,5)));
  await browser.close();
  return _curip;
}

function getRandomInt(min, max) {
  //min ~ max 사이의 임의의 정수 반환
  return Math.floor(Math.random() * (max - min)) + min;
}

function getCurTimestamp() {
  const d = new Date();
  return new Date(
    Date.UTC(
      d.getFullYear(),
      d.getMonth(),
      d.getDate(),
      d.getHours(),
      d.getMinutes(),
      d.getSeconds()
    )
  )
    .toISOString()
    .replace("T", "_")
    .replace("Z", "");
}

async function main() {
  while (1 !== 0) {
    let _curIP = await jsfn_getIP();
    let findIP = arr_useIP.find(
      (element, index, arr_useIP) => element === _curIP
    );
    await new Promise((resolve) =>
      setTimeout(resolve, 1000 * getRandomInt(10, 12))
    ); // 10~12초 딜레이 추가
    console.log("############# " + _curIP + " / findIP :" + findIP);
    // await new Promise(resolve => setTimeout(resolve, 1000*getRandomInt(300,540))); // 300~480초 딜레이 추가
    let _rnd = getRandomInt(250, 300);
    console.log(
      getCurTimestamp() +
        "#### main " +
        _rnd +
        " 초 딜레이 ### " +
        " _loopCnt : " +
        _loopCnt +
        "  / _mainProcessRunYN : " +
        _mainProcessRunYN
    );
    if (_mainProcessRunYN == "N") {
      if (findIP === undefined || findIP == "undefined") {
        // 사용하지 않은 IP 일때만 작동
        arr_useIP.push(_curIP);
        await jsfn_getHTML("", "N");
        await new Promise((resolve) => setTimeout(resolve, 1000 * _rnd));
      } else {
        console.log("사용된 IP라 작업 없이 다시 대기");
        await new Promise((resolve) => setTimeout(resolve, 1000 * 60));
      }
      // await jsfn_chkProxy();                               // proj_end = performance.now();
      // console.log(proj_end+":performance.now()")
      // console.log("["+ proj_end - proj_start+"]초 경 과"); // 현재의 시간에서 시작 시간 뺀 값 출력

      if (_AndroidYN == "Y") {
        await jsfn_wifi(true);
        await new Promise((resolve) => setTimeout(resolve, 3000));
        await jsfn_wifi(false);
        await new Promise((resolve) => setTimeout(resolve, 8000));
      }
    } else {
      await new Promise((resolve) => setTimeout(resolve, 1000 * 60)); // 60초 딜레이 추가
    }
  }
}
async function jsfn_wifi(_TF) {
  let _cmd = "";
  if (_TF) {
    //_cmd="sudo ifconfig /renew";
    _cmd = "termux-wifi-enable true";
  } else {
    //_cmd="sudo ifconfig /release";
    _cmd = "termux-wifi-enable false";
  }
  exec(_cmd, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
}
main();
