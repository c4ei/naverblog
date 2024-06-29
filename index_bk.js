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

  const page1 = (await browser.pages())[0]; // 첫 번째 탭

  const page2 = await browser.newPage();
  await page2.goto("https://m.naver.com", { waitUntil: "networkidle2" });
  await page2.goto(_gotoUrl3, { waitUntil: "networkidle2" });
  // ID와 비밀번호 입력 후 로그인 버튼 클릭
  // await page2.click("#locale_switch > option:nth-child(1)");
  await page2.type("#id", USER_ID);
  await new Promise((resolve) => setTimeout(resolve, 1000 * 1)); // 1s 대기
  await page2.type("#pw", USER_PASSWORD);
  await new Promise((resolve) => setTimeout(resolve, 1000 * 2)); // 2 대기
  // await page2.click("#submit_btn");
  // console.log("page.click -> #submit_btn ");
  // await new Promise((resolve) => setTimeout(resolve, 1000 * 6)); // 6 대기
  // 로그인 완료 대기
  await page2.waitForNavigation();


  // 특정 URL이 로드될 때까지 대기하는 함수
  await page2.waitForFunction(`window.location.href === '${_gotoUrl2}'`, { timeout: 60000 });
  console.log(`URL이 ${_gotoUrl2}로 로드되었습니다.`);

  // console.log("######### 57 #########");
  try {
    await page1.bringToFront(); // 탭 전환
    await page1.setViewport({ width: 0, height: 0 });
    await page1.goto(_gotoUrl4);
    await page1.waitForSelector("body");

    // fn_senWheel(400);
    // console.log("goto(_gotoUrl4)");

    try{
      const targetSelector = '#root > nav > div > span:nth-child(1) > a';
      await page1.waitForSelector(targetSelector);
  
      const likeButton = await page1.$(targetSelector);
      likeButton.click();
      console.log("likeButton.click();");
    }catch(e){
      console.log(e +" : e ");
      await page1.goto(_gotoUrl4); // 에러시 다시 보내기
      await page1.waitForSelector("body");
    }

    await page1.waitForFunction(`window.location.href === '${_gotoUrl4}'`, { timeout: 60000 });
    console.log(`URL이 ${_gotoUrl4}로 로드되었습니다.`);
  
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
      // console.log(JSON.stringify(offHearts));
      // off 클래스를 가진 하트가 없으면 종료
      if (offHearts.length === 0) {
        console.log('모든 off 하트를 클릭했습니다.');
        break;
      }

      // off 클래스를 가진 하트를 클릭
      for (const heart of offHearts) {
        try{
          await heart.click();
          // await page1.waitForTimeout(1000); // 클릭 후 1초 대기
          haear_click_cnt++;
          console.log(haear_click_cnt +" 좋아요 버튼을 클릭");
          await fn_wait(1, 1);
        }catch(e){
          console.log(e);
          await fn_wait(10, 15);
        }
      }

      // 스크롤을 한번 내림
      await page1.evaluate(() => {
        window.scrollBy(0, window.innerHeight);
      });
      await fn_wait(2, 3);
      // 스크롤 이후에 새로운 하트가 로드될 때까지 기다림
      try{
        await page1.waitForFunction(`document.querySelector('.u_likeit_list_btn._button.off') !== null`);
      }catch(e){
        break;
      }

      // 스크롤 이후의 페이지 높이를 가져옴
      const currentHeight = await page1.evaluate('document.body.scrollHeight');

      // 이전 스크롤 높이와 현재 스크롤 높이가 같으면 스크롤이 더이상 되지 않은 것이므로 종료
      if (previousHeight === currentHeight) {
        console.log('더 이상 스크롤할 수 없습니다.'+getCurTimestamp());
        break;
      }

      previousHeight = currentHeight; // 현재 스크롤 높이를 이전 스크롤 높이로 설정
      // await page1.waitForTimeout(3000); // 클릭 후 1초 대기
      await fn_wait(3, 5);
    }

    /////////////////////////////
    // 이웃 리스트 페이지로 이동
    const buddyListUrl = 'https://m.blog.naver.com/BuddyList.naver?blogId=aahcoin';
    await page1.goto(buddyListUrl);

    // 이웃 리스트에서 각 이웃 블로그 링크를 추출
    const buddyLinks = await page1.evaluate(() => {
      const links = [];
      document.querySelectorAll('.list_item .nickname').forEach((element) => {
        links.push(element.href);
      });
      return links;
    });

    for (const link of buddyLinks) {
      await page1.goto(link);

      // 특정 대기 시간 적용 (네트워크 상황에 따라 조정)
      await page1.waitForTimeout(2000);

      // "좋아요" 버튼 존재 여부 확인
      const likeButtonSelector = '.u_likeit_list_btn';
      const likedClass = 'u_likeit_list_btn_on';

      const isLiked = await page.evaluate((likeButtonSelector, likedClass) => {
        const likeButton = document.querySelector(likeButtonSelector);
        if (likeButton) {
          return likeButton.classList.contains(likedClass);
        }
        return false;
      }, likeButtonSelector, likedClass);

      if (!isLiked) {
        await page1.click(likeButtonSelector);
        console.log(`좋아요 클릭: ${link}`);
        await page1.waitForTimeout(1000); // "좋아요" 클릭 후 대기 시간
      } else {
        console.log(`이미 좋아요 클릭됨: ${link}`);
      }
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