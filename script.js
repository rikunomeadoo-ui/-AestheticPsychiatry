document.addEventListener('DOMContentLoaded', () => {
    // スムーススクロールの実装
    const navLinks = document.querySelectorAll('a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            // モーダル等へのリンクは除外
            if (this.getAttribute('href') === '#') return;

            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // ヘッダーの高さを考慮してスクロール位置を調整
                const headerHeight = document.getElementById('header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // モバイルメニューが開いている場合は閉じる
                if (mobileNav.classList.contains('active')) {
                    mobileNav.classList.remove('active');
                    menuBtn.classList.remove('active');
                }
            }
        });
    });

    // モバイルメニューの制御
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const mobileNav = document.querySelector('.desktop-nav');

    if (menuBtn && mobileNav) {
        menuBtn.addEventListener('click', () => {
            menuBtn.classList.toggle('active');
            mobileNav.classList.toggle('active');
        });
    }

    // スクロール時のヘッダー制御
    let lastScrollTop = 0;
    const header = document.getElementById('header');

    window.addEventListener('scroll', () => {
        let currentScroll = window.scrollY;

        // ヘッダーにシャドウを追加（トップからスクロールした時）
        if (currentScroll > 10) {
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
        } else {
            header.style.boxShadow = 'none';
        }

        lastScrollTop = currentScroll;
    }, { passive: true });

    // モーダルウィンドウの制御
    const modal = document.getElementById('booking-modal');
    const triggerBtn = document.getElementById('trigger-booking-modal');
    const closeBtn = document.getElementById('close-modal');

    if (triggerBtn && modal && closeBtn) {
        triggerBtn.addEventListener('click', () => {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden'; // 背景のスクロールを防止
        });

        closeBtn.addEventListener('click', () => {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        });

        // モーダルの背景クリックで閉じる
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
                document.body.style.overflow = '';
            }
        });
    }

    // Intersection Observerを利用したふんわり表示アニメーション（SPA的なフェードイン）
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // CSSの初期状態で透過と移動を設定
    const animateElements = document.querySelectorAll('.section, .hero');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    // お問い合わせフォームの隠しギミック（イースターエッグ）
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            const messageInput = document.getElementById('contact-message');
            if (messageInput) {
                // 1. 屋上（ピンク野獣）ギミックの条件：自力で向かう手段を聞いている場合
                const hasSelfDirection = /(自分|自力|直接|徒歩|一人|ひとり|歩き|自車)(で?)(向か|行|伺|来|着)/.test(message) || /(どうすれば|どうやって|どの様に|どのように|場所).*(向か|行|着)/.test(message) || message.includes('自分で向かいたい');

                // 2. パチンコギミックの条件：送迎・付き添いの担当者を特定しようとする場合
                const hasEscortKeyword = /(お?迎え|送迎|付き添い|付き人|同乗|同行|担当|来る人|来られる|お越しになる)/.test(message);
                const hasIdentityQuestion = /(誰|だれ|どなた|どんな|どのような|どういった|名前|なまえ|氏名|特徴|性別|男|女|関係|教えて|伺え|伺って|伺いた|知りたい|把握|確認|何者)/.test(message);

                if (hasSelfDirection) {
                    // 通常の遷移をキャンセルし、屋上ページへ
                    e.preventDefault();
                    window.location.href = 'okujo.html';
                } else if (hasEscortKeyword && hasIdentityQuestion) {
                    // 通常の遷移をキャンセルし、野獣パチンコへ
                    e.preventDefault();
                    showBeastEasterEgg();
                }
                // 条件に満たない場合は通常の action="reservation.html" による遷移へ
            }
        });
    }

    function showBeastEasterEgg() {
        // パチンコ演出ページへ遷移させる
        window.location.href = 'pachinko.html';
    }
});
