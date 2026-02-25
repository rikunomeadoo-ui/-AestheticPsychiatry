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
                const message = messageInput.value;
                // 場所関連のキーワードと人関連のキーワード群を正規表現で定義
                const hasLocationKeyword = /(アクセス|場所|行き方|住所|六本木|乃木坂|送迎|車|レクサス|どこ)/.test(message);
                const hasPersonKeyword = /(人|付き添い|同乗|付き人|同伴|誰|男|女)/.test(message);

                // 両方のカテゴリからそれぞれ1つ以上キーワードが含まれていれば発動
                if (hasLocationKeyword && hasPersonKeyword) {
                    // 通常の遷移（reservation.htmlへのホラー遷移）をキャンセル
                    e.preventDefault();

                    // 野獣ギミック（pachinko.html）の発動
                    showBeastEasterEgg();
                }
                // 含まれていない場合はそのまま action="reservation.html" により遷移する
            }
        });
    }

    function showBeastEasterEgg() {
        // パチンコ演出ページへ遷移させる
        window.location.href = 'pachinko.html';
    }
});
