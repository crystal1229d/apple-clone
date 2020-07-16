( () => {

    
    let yOffset = 0;    // window.pageYOffset 대신 쓸 변수 
    let prevScrollHeight = 0;   // 현재 스크롤 위치(yOffset)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이값의 합
    let currentScene = 0;   //현재 활성화된(눈 앞에 보고있는) 씬(scroll-section) <= prevScrollHeight와 yOffset을 비교하여 도출
    let enterNewScene = false;  // 새로운 scene이 시작된 순간 true

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
                messageA_opacity_in: [0, 1, { start: 0.1, end: 0.2 }],
                //messageB_opacity_in: [0, 1, { start: 0.3, end: 0.4 }],
                messageA_opacity_out: [1, 0, { start: 0.25, end: 0.3 }],

                messageA_translateY_in: [20, 0, { start: 0.1, end: 0.2 }],
                messageA_translateY_out: [0, 20, { start: 0.25, end: 0.3 }],
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
            if (sceneInfo[i].type === 'sticky') {
                sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;    //윈도의 전역객체는 앞의 window. 생략가능
            } else if(sceneInfo[i].type === 'normal' ) {
                sceneInfo[i].scrollHeight = sceneInfo[i].objs.container.offsetHeight;
            }
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

    function calcValues(values, currentYOffset) {

        let rv;
		// 현재 씬(스크롤섹션)에서 스크롤된 범위를 비율로 구하기
		const scrollHeight = sceneInfo[currentScene].scrollHeight;
		const scrollRatio = currentYOffset / scrollHeight;

		if (values.length === 3) {
			// start ~ end 사이에 애니메이션 실행
			const partScrollStart = values[2].start * scrollHeight;
			const partScrollEnd = values[2].end * scrollHeight;
			const partScrollHeight = partScrollEnd - partScrollStart;

			if (currentYOffset >= partScrollStart && currentYOffset <= partScrollEnd) {
				rv = (currentYOffset - partScrollStart) / partScrollHeight * (values[1] - values[0]) + values[0];
			} else if (currentYOffset < partScrollStart) {
				rv = values[0];
			} else if (currentYOffset > partScrollEnd) {
				rv = values[1];
			}
		} else {
			rv = scrollRatio * (values[1] - values[0]) + values[0];
		}

		return rv;
    }

    function playAnimation() {
        const objs = sceneInfo[currentScene].objs;
		const values = sceneInfo[currentScene].values;
        // (현재 씬에서 스크롤한 길이) =  (전체스크롤길이) - (이전 씬의길이의합)
        // 전체스크롤과 달리, 씬이 바뀔때마다 0으로 초기화됨 
        const currentYOffset = yOffset - prevScrollHeight;
        const scrollHeight = sceneInfo[currentScene].scrollHeight;
        const scrollRatio = currentYOffset / scrollHeight; // 현재 씬의 scrollHeight

        // console.log(currentScene);

        switch (currentScene) {
            case 0:
                if (scrollRatio <= 0.22){      
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
                    objs.messageA.style.transform = `translateY(${calcValues(values.messageA_translateY_in, currentYOffset)}%)`;
                } else {
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
                    objs.messageA.style.transform = `translateY(${calcValues(values.messageA_translateY_out, currentYOffset)}%)`;
                }
                break;
            case 1:
                break;
            case 2:
                break;
            case 3:
                break;
        }
    }

    function scrollLoop() {

        enterNewScene = false;
        prevScrollHeight = 0;   // 값이 누적되지 않게끔 스크롤할때마다 0으로 초기화
        
        // 현재 보이는 화면에서 몇 번째 스크롤섹션이 스크롤되고있는지 판별
        for (let i = 0; i < currentScene; i++) {
            prevScrollHeight += sceneInfo[i].scrollHeight;
        }

        if (yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
            enterNewScene = true;
            currentScene++;
            document.body.setAttribute('id', `show-scene-${currentScene}`)
        }

        if(yOffset < prevScrollHeight) {
            enterNewScene = true;
            if(currentScene === 0) return;  // 스크롤 바운싱의 경우 yOffset값이 -가 되므로 이때 currentScene이 -되는 것을 방지
            currentScene--;
            document.body.setAttribute('id', `show-scene-${currentScene}`)
        }

        if(enterNewScene) return;   // 씬이 바뀌는 순간 이상한 값을 한 번 무시한다

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