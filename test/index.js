const fs = require('fs');
const {Builder, By, Key, until} = require('selenium-webdriver');

var delay = (secondToDelay)=>{
    return new Promise(resolve=>{
        setTimeout(()=>{
            resolve(1);
        },secondToDelay * 1000);
    });
}

var zeroPadding = (number,size)=>{
    let result = '';    
    let pivot = 1;
    number = number * 1;
    size = size * 1;

    for(let i=0; i<size; i++){
        let num = (number%(pivot*10) - number%pivot)/pivot;
        pivot = pivot * 10;
        result = num + result;
    }

    return result;
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
    let screenElementId = 'snapshot'; // el.id
    let radioElementsName = 'image-mode'; // el.name
    let maxTemperature = 'temp-global-max'; // el.class
    let minTemperature = 'temp-global-min'; // el.class

    const minTemp = 4;
    const maxTemp = 100;

    let driver = await new Builder().forBrowser('chrome').build();

    // function setMaxTemp(){
    //     var promise = await driver.findElements(By.className(maxTemperature)).then(function(els){
    //         if(els.length){
    //             els[0].sendKeys(maxTemp,Key.ENTER);
    //             return true;
    //         }
    //     })
    //     return promise;
    // }

    // function setMinTemp(){
    //     var promise = await driver.findElements(By.className(minTemperature)).then(function(els){
    //         if(els.length){
    //             els[0].sendKeys(minTemp,Key.ENTER);
    //             return true;
    //         }
    //     })
    //     return promise;
    // }


    function check_login(){
        var promise = driver.findElement(By.id(fullBtn)).then(function(el){
            if(el){
                console.log('login success');
                return true;
            }
        })
        return promise;
    
    }



    // Login part

    try{
        await driver.get(uri);
        await delay(3);
        let inputForId = await driver.findElement(By.id(idInput));
        let inputForPw = await driver.findElement(By.id(pwInput));
        let buttonForLogin = await driver.findElement(By.id(loginBtn));

        inputForId.sendKeys(user.id);
        await delay(1);
        inputForPw.sendKeys(user.pw);
        await delay(1);
        buttonForLogin.click();

        await delay(5);
    }catch(e){
        console.log(e,'login process error');
    }finally{
        console.log('login process done');
    }



    // Set temperature scope part

    try {
        console.log('set temperature scope start');
        await driver.findElements(By.className(maxTemperature)).then(function(els){
            if(els.length){
                els[0].click();
                els[0].sendKeys(maxTemp);
                return true;
            }
        });
        await delay(1);
        await driver.findElement(By.id(screenElementId)).then(function(el){
            el.click();
        })
        await delay(1);
        console.log('[ setting temperature ] max - temperature : ',maxTemp);
        // await driver.findElements(By.className(minTemperature)).then(function(els){
        //     if(els.length){
        //         els[0].sendKeys(minTemp,Key.ENTER);
        //         return true;
        //     }
        // });

        // await delay(2);
        // console.log('[ setting temperature ] min - temperature : ',minTemp);
    }catch(e){
        console.log(e);
        console.log('[ setting temperature ] set temperature scope error');
    }finally{
        console.log('[ setting temperature ] set temperature scope done');

    }



    // take screen shot

    


    try {
        
        driver.wait(check_login,10000);
        // fullScreen
        // let buttonForFullscreen = await driver.findElement(By.id(fullBtn));
        // buttonForFullscreen.click();
        // let radioTab = await driver.findElement(By.id('button-image-mode'));
        
        let radios = await driver.findElements(By.name(radioElementsName));           
        let labelVisual = radios[2].findElement(By.xpath('./..'));
        let labelThermal = radios[1].findElement(By.xpath('./..'));
        
        await delay(1);
        let startTime = new Date().getTime();
        let duration = 120 // minute
        let endTime = startTime + (duration * 60 * 1000);
        let serialNumber = 0;

        


        await delay(1);
        let now = new Date().getTime();
        while(now < endTime){
            serialNumber += 1;
            now = new Date().getTime();

            // fileNameBase
            let fileName = zeroPadding(serialNumber,7)+'_'+ now +'.jpg';


            // msx - radio 0

            // visual - radio 2
            let visualName = 'images/v_'+fileName
            // radioTab.click();
            
            
            // radioForChannel[2].click();
            await delay(0.3);
            
            
            labelVisual.click();
            // await delay(0.3);
            // await driver.findElement(By.id(screenElementId)).then(function(el){
            //     el.click();
            // })
            
            
            await delay(0.3);
            let vdata = await driver.takeScreenshot();
            fs.writeFileSync(visualName,vdata,'base64');


            // thermal - radio 1
            let thermalName = 'images/t_'+fileName
            // radioTab.click();
            // radioForChannel[1].click();            
            await delay(0.3);
            labelThermal.click();
            // await delay(0.3);
            // await driver.findElement(By.id(screenElementId)).then(function(el){
            //     el.click();
            // })
            await delay(0.3);
            
            let tdata = await driver.takeScreenshot();
            // let dateDay = new Date().toLocaleDateString();
            // let hour = new Date().getHours();
            // let minute = new Date().getMinutes();
            // let second = new Date().getSeconds();
            // let date = `${dateDay} ${hour}시${minute}분${second}초`;
            
            fs.writeFileSync(thermalName,tdata,'base64');
            await delay(1);
            waitCount+=1;
            console.log('captured image count :' + waitCount);
        }
    } catch (e) {
        console.log(e);
    }finally{

    }


}
test3();

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
// test2();

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