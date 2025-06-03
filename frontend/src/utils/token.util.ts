class TokenUtil {
  user_token() {
    if (localStorage.getItem('accessToken')) return true;
    return true;
  }

  admin_token() {
    if (localStorage.getItem('adminToken')) return true;
    return false;
  }
}

export default new TokenUtil();
