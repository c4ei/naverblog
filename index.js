const puppeteer = require("puppeteer");
const dotenv = require("dotenv");
dotenv.config();

const USER_ID = process.env.NAVER_ID;
const USER_PASSWORD = process.env.NAVER_PWD;

const _gotoUrl1 = "https://www.threads.net/@c4ei_net/post/C6ym_cLBoKS";
const _gotoUrl2 = "https://m.blog.naver.com/aahcoin/223442940171";
const _gotoUrl3 = "https://nid.naver.com/nidlogin.login?svctype=262144&url=https%3A%2F%2Fm.blog.naver.com%2Faahcoin%2F223442940171";
const _gotoUrl4 = "https://m.blog.naver.com/FeedList.naver";

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

  const page1 = (await browser.pages())[0];

  try {
    const page2 = await browser.newPage();
    await page2.goto("https://m.naver.com", { waitUntil: "networkidle2" });
    await page2.goto(_gotoUrl3, { waitUntil: "networkidle2" });

    await page2.type("#id", USER_ID);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await page2.type("#pw", USER_PASSWORD);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await page2.waitForNavigation();

    await page2.waitForFunction(`window.location.href === '${_gotoUrl2}'`, { timeout: 60000 });
    console.log(`URL이 ${_gotoUrl2}로 로드되었습니다.`);
    await fn_wait(5, 8);
    await page2.close(); // page2 닫기

    await page1.bringToFront();
    await page1.setViewport({ width: 0, height: 0 });
    await page1.goto(_gotoUrl4);
    await page1.waitForSelector("body");

    try {
      const targetSelector = '#root > nav > div > span:nth-child(1) > a';
      await page1.waitForSelector(targetSelector);

      const likeButton = await page1.$(targetSelector);
      await likeButton.click();
      console.log("likeButton.click();");
    } catch (e) {
      console.log(e + " : e ");
      await page1.goto(_gotoUrl4);
      await page1.waitForSelector("body");
    }

    await page1.waitForFunction(`window.location.href === '${_gotoUrl4}'`, { timeout: 60000 });
    console.log(`URL이 ${_gotoUrl4}로 로드되었습니다.`);

    await page1.evaluate(() => {
      document.addEventListener('dblclick', async (event) => {
        alert('heart');
        event.preventDefault();

        const hearts = document.querySelectorAll('.u_likeit_list_btn._button.off');

        for (const heart of hearts) {
          await heart.click();
          await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 2000) + 1000));
        }
      });
    });

    await page1.mouse.move(250, 251);
    await fn_wait(10, 20);
    await fn_senWheel(page1, 400);

    let previousHeight;
    let haear_click_cnt = 0;
    while (true) {
      const offHearts = await page1.$$('.u_likeit_list_btn._button.off');
      if (offHearts.length === 0) {
        console.log('모든 off 하트를 클릭했습니다.');
        break;
      }

      for (const heart of offHearts) {
        try {
          await heart.click();
          haear_click_cnt++;
          console.log(haear_click_cnt + " 좋아요 버튼을 클릭");
          await fn_wait(1, 1);
        } catch (e) {
          console.log(e);
          await fn_wait(10, 15);
        }
      }

      await page1.evaluate(() => {
        window.scrollBy(0, window.innerHeight);
      });
      await fn_wait(2, 3);

      try {
        await page1.waitForFunction(`document.querySelector('.u_likeit_list_btn._button.off') !== null`);
      } catch (e) {
        break;
      }

      const currentHeight = await page1.evaluate('document.body.scrollHeight');
      if (previousHeight === currentHeight) {
        console.log('더 이상 스크롤할 수 없습니다.' + getCurTimestamp());
        break;
      }
      previousHeight = currentHeight;
      await fn_wait(3, 5);
    }

    const buddyListUrl = 'https://m.blog.naver.com/BuddyList.naver?blogId=aahcoin';
    await page1.goto(buddyListUrl);

    const buddyLinks = await page1.evaluate(() => {
      const links = [];
      document.querySelectorAll('.list_item .nickname').forEach((element) => {
        links.push(element.href);
      });
      return links;
    });

    for (const link of buddyLinks) {
      await page1.goto(link);
      await page1.waitForTimeout(2000);

      const likeButtonSelector = '.u_likeit_list_btn';
      const likedClass = 'u_likeit_list_btn_on';

      const isLiked = await page1.evaluate((likeButtonSelector, likedClass) => {
        const likeButton = document.querySelector(likeButtonSelector);
        if (likeButton) {
          return likeButton.classList.contains(likedClass);
        }
        return false;
      }, likeButtonSelector, likedClass);

      if (!isLiked) {
        await page1.click(likeButtonSelector);
        console.log(`좋아요 클릭: ${link}`);
        await page1.waitForTimeout(1000);
      } else {
        console.log(`이미 좋아요 클릭됨: ${link}`);
      }
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await browser.close(); // 브라우저 닫기
  }
}

autoLikeNaverBlog();

function getRandomInt(min, max) {
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

async function fn_wait(_start, _end) {
  await new Promise((resolve) =>
    setTimeout(resolve, 1000 * getRandomInt(_start, _end))
  );
}

async function fn_senWheel(page, _heigh) {
  await page.mouse.wheel({ deltaY: _heigh });
}
