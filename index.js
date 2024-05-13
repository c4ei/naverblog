/* index.js */

const puppeteer = require("puppeteer");
const dotenv = require("dotenv");
dotenv.config();

const USER_ID = process.env.NAVER_ID; // 여기에 자신의 네이버 아이디를 입력하세요.
const USER_PASSWORD = process.env.NAVER_PWD; // 여기에 자신의 네이버 비밀번호를 입력하세요.

const _gotoUrl1 = "https://www.threads.net/@c4ei_net/post/C6ym_cLBoKS";
const _gotoUrl2 = "https://m.blog.naver.com/aahcoin/223442940171";
const _gotoUrl3 =
  "https://nid.naver.com/nidlogin.login?svctype=262144&url=https%3A%2F%2Fm.blog.naver.com%2Faahcoin%2F223442940171";
const _gotoUrl4 = "https://m.blog.naver.com/FeedList.naver";
// let Main_URL = "https://section.blog.naver.com/BlogHome.naver?directoryNo=0"; // &currentPage=1&groupId=0

async function autoLikeNaverBlog() {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: "/usr/bin/google-chrome",
    args: [
      "--disable-gpu",
      "--disable-dev-shm-usage",
      "--disable-setuid-sandbox",
      "--no-sandbox",
    ],
  });
  // if(!browser) browser = await puppeteer.launch({
  //   headless: true, // NO SHOW
  //   executablePath: '/usr/bin/chromium-browser',
  //   args: ['--disable-gpu', '--disable-setuid-sandbox', '--no-sandbox', '--no-zygote']
  // });
  // const page = await browser.newPage();
  const page1 = (await browser.pages())[0]; // 첫 번째 탭
  // let currentPage = 1;


  const page2 = await browser.newPage();
  await page2.goto("https://m.naver.com", { waitUntil: "networkidle2" });
  await page2.goto(_gotoUrl3, { waitUntil: "networkidle2" });
  // ID와 비밀번호 입력 후 로그인 버튼 클릭
  await page2.type("#id", USER_ID);
  await new Promise((resolve) => setTimeout(resolve, 1000 * 1)); // 1s 대기
  await page2.type("#pw", USER_PASSWORD);
  await new Promise((resolve) => setTimeout(resolve, 1000 * 2)); // 2 대기
  await page2.click("#submit_btn");
  // console.log("page.click -> #submit_btn ");
  // await new Promise((resolve) => setTimeout(resolve, 1000 * 6)); // 6 대기


  try {
    await page1.bringToFront(); // 탭 전환
    await page1.setViewport({ width: 0, height: 0 });
    // 네이버 로그인 페이지로 이동
    // await page.goto("https://nid.naver.com/nidlogin.login");
    await page1.goto(_gotoUrl1);
    await page1.waitForSelector("body");
    await new Promise((resolve) => setTimeout(resolve, 1000 * 5)); // 6 대기

    await page1.goto(_gotoUrl2);
    await page1.waitForSelector("body");
    await new Promise((resolve) => setTimeout(resolve, 1000 * 5)); // 6 대기

    await page1.goto(_gotoUrl3);
    await page1.waitForSelector("body");
    await new Promise((resolve) => setTimeout(resolve, 1000 * 5)); // 6 대기


    // await page.waitForSelector("body");
    // await new Promise(resolve => setTimeout(resolve, 1000*5)); // 5s 대기

    await page1.goto(_gotoUrl4);
    await page1.waitForSelector("body");
    await fn_wait(3, 3);
    // await page2.click("#root > nav > div > span:nth-child(1) > a > span");
    await fn_wait(3, 3);
    fn_senWheel(400);

    // 우클릭 이벤트를 시뮬레이트하기 위해 페이지에 JavaScript를 주입합니다.
    await page1.evaluate(() => {
      document.addEventListener('dblclick', async (event) => {
        alert('heart');
        event.preventDefault(); // 더블클릭 이벤트의 기본 동작을 막습니다.
    
        // 페이지 내의 하트 요소를 찾습니다.
        const hearts = document.querySelectorAll('.u_likeit_list_btn._button.off');
    
        // 각 하트를 클릭합니다.
        for (const heart of hearts) {
          await heart.click(); // 하트를 클릭합니다.
          await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 2000) + 1000)); // 1~3초의 랜덤한 대기 시간을 추가합니다.
        }
      });
    });
    
    // await page.goto("https://section.blog.naver.com/BlogHome.naver?directoryNo=0&currentPage=1&groupId=0");
    // await page.waitForNavigation();

    // await page.goto(_gotoUrl2, { waitUntil: "networkidle2" });
    // await page.waitForSelector("body");
    await page1.mouse.move(250, 251);
    await fn_wait(10, 20);
    fn_senWheel(400);

    let previousHeight; // 이전 스크롤 높이를 저장할 변수
    let haear_click_cnt=0;
    // off 클래스를 가진 하트를 모두 클릭할 때까지 반복
    while (true) {
      // off 클래스를 가진 하트 요소를 가져옴
      const offHearts = await page1.$$('.u_likeit_list_btn._button.off');
      
      // off 클래스를 가진 하트가 없으면 종료
      if (offHearts.length === 0) {
        console.log('모든 off 하트를 클릭했습니다.');
        break;
      }

      // off 클래스를 가진 하트를 클릭
      for (const heart of offHearts) {
        await heart.click();
        // await page1.waitForTimeout(1000); // 클릭 후 1초 대기
        haear_click_cnt++;
        console.log(haear_click_cnt +" 좋아요 버튼을 클릭");
        await fn_wait(1, 1);
      }

      // 스크롤을 한번 내림
      await page1.evaluate(() => {
        window.scrollBy(0, window.innerHeight);
      });
      await fn_wait(1, 2);
      // 스크롤 이후에 새로운 하트가 로드될 때까지 기다림
      await page1.waitForFunction(`document.querySelector('.u_likeit_list_btn._button.off') !== null`);

      // 스크롤 이후의 페이지 높이를 가져옴
      const currentHeight = await page1.evaluate('document.body.scrollHeight');

      // 이전 스크롤 높이와 현재 스크롤 높이가 같으면 스크롤이 더이상 되지 않은 것이므로 종료
      if (previousHeight === currentHeight) {
        console.log('더 이상 스크롤할 수 없습니다.');
        break;
      }

      previousHeight = currentHeight; // 현재 스크롤 높이를 이전 스크롤 높이로 설정
      // await page1.waitForTimeout(3000); // 클릭 후 1초 대기
      await fn_wait(3, 3);
    }

    async function fn_wait(_start, _end) {
      await new Promise((resolve) =>
        setTimeout(resolve, 1000 * getRandomInt(_start, _end))
      );
    }

    async function fn_senWheel(_heigh) {
      await page1.mouse.wheel({ deltaY: _heigh });
    }
  } catch (error) {
    console.error("Error:", error);
  }
  // finally { }
  //
  // await browser.close();
}

autoLikeNaverBlog();

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

function delay(time) {
  return new Promise(function(resolve) {
    setTimeout(resolve, time);
  });
}