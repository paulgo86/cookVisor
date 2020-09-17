const fs = require('fs');
const {Builder, By, Key, until} = require('selenium-webdriver');

var delay = (secondToDelay)=>{
    return new Promise(resolve=>{
        setTimeout(()=>{
            resolve(1);
        },secondToDelay * 1000);
    });
}
var test3 = async () => {
    let uri = 'http://192.168.0.11/login';
    let user = {
        id:'admin',
        pw:'admin'
    }
    let waitCount =0;
    let fullBtn = 'button-fullscreen';
    let idInput = 'login_input_username';
    let pwInput = 'login_input_password';
    let loginBtn = 'button-login';
    let driver = await new Builder().forBrowser('chrome').build();

    function check_login(){
        var promise = driver.findElement(By.id(fullBtn)).then(function(el){
            if(el){
                console.log('login success');
                return true;
            }
        })
        return promise;
    }

    try{
        


        await driver.get(uri);
        await delay(5);
        let inputForId = await driver.findElement(By.id(idInput));
        let inputForPw = await driver.findElement(By.id(pwInput));
        let buttonForLogin = driver.findElement(By.id(loginBtn));

        inputForId.sendKeys(user.id);
        inputForPw.sendKeys(user.pw);
        buttonForLogin.click();

        await delay(5);

        

    }catch(e){
        console.log(e,'login process error');
    }finally{
        console.log('login process done');
    }


    try {
        
        driver.wait(check_login,10000);
        let buttonForFullscreen = await driver.findElement(By.id(fullBtn));
        buttonForFullscreen.click();

        await delay(1);
        while(waitCount<30){
            let data = await driver.takeScreenshot();
            let dateDay = new Date().toLocaleDateString();
            let hour = new Date().getHours();
            let minute = new Date().getMinutes();
            let second = new Date().getSeconds();
            let date = `${dateDay} ${hour}시${minute}분${second}초`;
            let fileName = '['+date+'] image_'+waitCount+'.jpg';
            fs.writeFileSync(fileName,data,'base64');
            await delay(1);
            waitCount+=1;
            console.log('captured image count :' + waitCount);
        }
    } catch (e) {
        
    }finally{

    }


}
//test3();

var test2 = async () => {
    

    let driver = await new Builder().forBrowser('chrome').build();

    
    let searchIdx = 0;
    let findFlag = false;
    let waitCount =0;
    let uri = 'https://www.google.com';
    let keyword = '에이브로스 스마트폰 구아바';
    function check_videos(){
        var promise = driver.getTitle().then(function(title){
            if(title.indexOf(keyword)!=-1){
                console.log('succeess - ',title);
                return true;
            }else{
                console.log('fail - ',title);
            }
        })
        return promise;
    }

   
    try{
        await driver.get(uri);
        let inputs = await driver.findElements(By.css('input'));
        while(waitCount<30){
            
            console.log(`[${waitCount}] input length = ${inputs.length}`);

            if(inputs.length >0){
                findFlag = true;
                break;
            }
            await delay(1);
            waitCount+=1;
        }
        if(!findFlag){
            return console.log('couldn\'t find input tag');            
        }
        await delay(1);
        findFlag = false;
        waitCount = 0;

        for(let i=0; i<inputs.length; i++){
            console.log('=======',i,'=======');
            let title = await inputs[i].getAttribute('title');
            let type = await inputs[i].getAttribute('type');
            console.log(title,'-',type);
            if(title == '검색' || title == 'search'){
                searchIdx = i;
                findFlag = true;
                break;
            }
        }

        await inputs[searchIdx].sendKeys(keyword);
        await delay(1);
        await inputs[searchIdx].sendKeys(Key.ENTER);
        
        driver.wait(check_videos,10000);
        let videos = await driver.findElements(By.className('y8AWGd'));
        
        while(waitCount<30){
            
            console.log(`[${waitCount}] video link length = ${videos.length}`);

            if(videos.length >0){
                findFlag = true;
                break;
            }
            await delay(1);
            waitCount+=1;
        }
        if(!findFlag){
            return console.log('couldn\'t find videos tag');            
        }
        findFlag =false;
        waitCount = 0;

        (await videos[0].findElement(By.css('a'))).click();
        console.log('a');

        try {
            // driver.wait(check_play,10000);
            let playBtn = await driver.findElement(By.xpath(`//button[@aria-label='재생(k)']`));
            console.log(playBtn);
            await delay(1)
            console.log('b');
            
            
            let button = (await driver.findElement(By.xpath(`//button[@aria-label='재생(k)']`)));

            console.log('button = ',button);

            if(button){
                console.log('c');
                button.click();
            }    
        } catch (error) {
            console.log(error);
        }
        
        
        await delay(1);
        while(waitCount<30){
            let data = await driver.takeScreenshot();
            let dateDay = new Date().toLocaleDateString();
            let hour = new Date().getHours();
            let minute = new Date().getMinutes();
            let second = new Date().getSeconds();
            let date = `${dateDay} ${hour}시${minute}분${second}초`;
            let fileName = '['+date+'] image_'+waitCount+'.jpg';
            fs.writeFileSync(fileName,data,'base64');
            await delay(1);
            waitCount+=1;
            console.log('captured image count :' + waitCount);
        }
        

    }catch(e){
        console.log('error');
        console.log(e);
    }finally{
        await driver.quit();
    }
}
test2();

var test = async () => {
    var webdriver = require('selenium-webdriver'),
        By = webdriver.By;
    var driver = new webdriver.Builder()
        .forBrowser('chrome')
        .build();

    
    let searchIdx = 0;
    let findFlag = false;
    let waitCount =0;

    let uri = 'https://www.google.com';
    let keyword = '에이브로스 스마트폰 구아바\n';



    let result = await driver.get(uri);
    return console.log(result);
    
    

    
    while(waitCount<30){
        let inputs = (await driver).findElements(By.css('input'));
        for(let i=0; i<inputs.length; i++){
            console.log('=======',i,'=======');
            let title = await inputs[i].getAttribute('title');
            let type = await inputs[i].getAttribute('type');
            console.log(title,'-',type);
            if(title == '검색' || title == 'search'){
                searchIdx = i;
                findFlag = true;
                break;
            }
        }
        
        await delay(1);
        waitCount += 1;
    }

    if(!findFlag){
        return console.log('cannot find search bar');
    }
    
    findFlag = false;

    elements[searchIdx].sendKeys(keyword);

    let delayCount =0;
    // 페이지를 이동 했는지 체크
    let videos = [];
    while(!findFlag){
        videos = (await driver).findElements(By.xpath('//video'));
        if(videos.length >0){
            console.log('found video tag count = ',videos.length);
            findFlag = true;
            break;
        }

        delayCount +=1;
        await delay(1);
        console.log('not page found yet. waiting count = ',delayCount);        
    }
    
}

// test();