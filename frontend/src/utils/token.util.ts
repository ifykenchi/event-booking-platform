class TokenUtil {
  user_token() {
    if (localStorage.getItem('accessToken')) return true;
    return false;
  }

  admin_token() {
    if (localStorage.getItem('adminToken')) return true;
    return false;
  }
}

export default new TokenUtil();
