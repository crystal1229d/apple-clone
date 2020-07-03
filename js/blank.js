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
                container: document.querySelector('#scroll-section-0')
            },
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
    }

    function scrollLoop() {
        // 현재 보이는 화면에서 몇 번째 스크롤섹션이 스크롤되고있는지 판별
        for (let i = 0; i < sceneInfo.length; i++) {
            prevScrollHeight += sceneInfo[i].scrollHeight;
        }

        console.log(prevScrollHeight);
    }

    
    window.addEventListener('resize', setLayout); // 윈도우창의 사이즈가 변할때 setLayout() 실행
    window.addEventListener('scroll', () => {
        yOffset = window.pageYOffset;
        scrollLoop();   // setLayout처럼 여기에서 바로 정의해도되지만 처리해야할 다른 함수도 많아서 깔끔하게하기 위해 밖에서 정의
    });

    setLayout();


} )();