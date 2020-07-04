( () => {

    
    let yOffset = 0;    // window.pageYOffset 대신 쓸 변수 
    let prevScrollHeight = 0;   // 현재 스크롤 위치(yOffset)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이값의 합
    let currentScene = 0;   //현재 활성화된(눈 앞에 보고있는) 씬(scroll-section) <= prevScrollHeight와 yOffset을 비교하여 도출

    const sceneInfo = [
        {
            // 0
            type: 'sticky',
            heightNum: 5,   // 브라우저 높이의 5배로 scrollHeight 세팅
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-0'),
                messageA : document.querySelector('#scroll-section-0 .main-message.a'),
                messageB : document.querySelector('#scroll-section-0 .main-message.b'),
                messageC : document.querySelector('#scroll-section-0 .main-message.c'),
                messageD : document.querySelector('#scroll-section-0 .main-message.d')
            },
            values: {
                messageA_opacity: [0, 1]    
            }
        },
        {
            // 1
            type: 'normal',
            heightNum: 5,   // 브라우저 높이의 5배로 scrollHeight 세팅
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-1')
            },
        },
        {   
            // 2
            type: 'sticky',
            heightNum: 5,   // 브라우저 높이의 5배로 scrollHeight 세팅
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-2')
            },
        },
        {
            // 3
            type: 'sticky',
            heightNum: 5,   // 브라우저 높이의 5배로 scrollHeight 세팅
            scrollHeight: 0,
            objs: {
              container: document.querySelector('#scroll-section-3')  
            },
        }
    ];

    function setLayout() {
        // 각 스크롤 섹션의 높이 세팅
        for (let i = 0; i < sceneInfo.length; i++) {
            sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;    //윈도의 전역객체는 앞의 window. 생략가능
            sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
        }

        // 새로고침한 경우 알맞은 currentScene 을 부여하므로써 body에 올바른 show-scene-n id를 설정
        yOffset = window.pageYOffset;
        let totalScrollHeight = 0;
        for (let i = 0; i < sceneInfo.length; i++) {
            totalScrollHeight += sceneInfo[i].scrollHeight;
            if (totalScrollHeight >= yOffset) {
                currentScene = i;
                break;
            }
        }
        document.body.setAttribute('id', `show-scene-${currentScene}`);

    }

    function playAnimation() {
        switch (currentScene) {
            case 0:
                console.log('0 play');
                break;
            case 1:
                console.log('1 play');
                break;
            case 2:
                console.log('2 play');
                break;
            case 3:
                console.log('3 play');
                break;
        }
    }

    function scrollLoop() {
        prevScrollHeight = 0;   // 값이 누적되지 않게끔 스크롤할때마다 0으로 초기화
        // 현재 보이는 화면에서 몇 번째 스크롤섹션이 스크롤되고있는지 판별
        for (let i = 0; i < currentScene; i++) {
            prevScrollHeight += sceneInfo[i].scrollHeight;
        }

        if (yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
            currentScene++;
            document.body.setAttribute('id', `show-scene-${currentScene}`)
        }

        if(yOffset < prevScrollHeight) {
            if(currentScene === 0) return;  // 스크롤 바운싱의 경우 yOffset값이 -가 되므로 이때 currentScene이 -되는 것을 방지
            currentScene--;
            document.body.setAttribute('id', `show-scene-${currentScene}`)
        }

        playAnimation();
    }

    
    window.addEventListener('scroll', () => {
        yOffset = window.pageYOffset;
        scrollLoop();   // setLayout처럼 여기에서 바로 정의해도되지만 처리해야할 다른 함수도 많아서 깔끔하게하기 위해 밖에서 정의
    });

    window.addEventListener('load', setLayout);
    //window.addEventListener('DOMContentLoaded', setLayout);
    window.addEventListener('resize', setLayout); // 윈도우창의 사이즈가 변할때 setLayout() 실행
    


} )();