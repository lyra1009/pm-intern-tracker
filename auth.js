// 认证模块 - 密码通过 GitHub Secrets 注入，不暴露在前端代码中
(function() {
    // 从环境变量获取密码（构建时注入）
    const AUTH_PASSWORD = '{{SITE_PASSWORD}}';
    
    // 存储认证状态
    const AUTH_KEY = 'pm_auth_token';
    const AUTH_EXPIRY = 24 * 60 * 60 * 1000; // 24小时
    
    // 生成简单 token（基于密码哈希）
    function generateToken(pwd) {
        let hash = 0;
        for (let i = 0; i < pwd.length; i++) {
            const char = pwd.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return 'auth_' + Math.abs(hash).toString(16) + '_' + Date.now();
    }
    
    // 验证密码
    function verifyPassword(input) {
        return input === AUTH_PASSWORD;
    }
    
    // 检查是否已认证
    function isAuthenticated() {
        try {
            const auth = JSON.parse(localStorage.getItem(AUTH_KEY) || '{}');
            if (!auth.token || !auth.expiry) return false;
            if (Date.now() > auth.expiry) {
                localStorage.removeItem(AUTH_KEY);
                return false;
            }
            // 验证 token 有效性
            const expectedToken = generateToken(AUTH_PASSWORD);
            return auth.token.startsWith(expectedToken.split('_').slice(0, 2).join('_'));
        } catch (e) {
            return false;
        }
    }
    
    // 设置认证状态
    function setAuthenticated() {
        const token = generateToken(AUTH_PASSWORD);
        localStorage.setItem(AUTH_KEY, JSON.stringify({
            token: token,
            expiry: Date.now() + AUTH_EXPIRY
        }));
    }
    
    // 清除认证
    function clearAuth() {
        localStorage.removeItem(AUTH_KEY);
    }
    
    // 检查密码并跳转
    window.checkAuth = function() {
        const input = document.getElementById('pwd').value.trim();
        if (verifyPassword(input)) {
            setAuthenticated();
            location.href = 'tracker.html';
        } else {
            document.getElementById('err').style.display = 'block';
            document.getElementById('pwd').value = '';
            document.getElementById('pwd').focus();
        }
    };
    
    // 页面加载时检查认证
    window.checkPageAuth = function() {
        if (!isAuthenticated()) {
            location.href = 'index.html';
        }
    };
    
    // 登出
    window.logout = function() {
        clearAuth();
        location.href = 'index.html';
    };
    
    // 如果密码未设置（本地开发），显示提示
    if (AUTH_PASSWORD === '{{SITE_PASSWORD}}') {
        console.warn('警告：密码未配置，使用默认密码 "27PM"');
    }
})();
