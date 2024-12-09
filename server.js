const express = require('express');
const axios = require('axios');
const app = express();

// 替换为你的 GitHub OAuth 配置
const CLIENT_ID = 'Ov23liYAWYYnsBZ4AGOE';
const CLIENT_SECRET = '3d224b10249e5da0095305c75d739339307ad414';
const ALLOWED_USER = 'knightmaro'; // 你的 GitHub 用户名

app.use(express.static('public'));

app.get('/auth/github', async (req, res) => {
    const code = req.query.code;
    
    try {
        // 获取访问令牌
        const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            code: code
        }, {
            headers: {
                accept: 'application/json'
            }
        });

        const accessToken = tokenResponse.data.access_token;

        // 获取用户信息
        const userResponse = await axios.get('https://api.github.com/user', {
            headers: {
                Authorization: `token ${accessToken}`
            }
        });

        const username = userResponse.data.login;

        if (username === ALLOWED_USER) {
            res.redirect(`/admin.html?token=${accessToken}`);
        } else {
            res.redirect('/login.html?error=unauthorized');
        }
    } catch (error) {
        console.error('Auth Error:', error);
        res.redirect('/login.html?error=auth_failed');
    }
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
}); 