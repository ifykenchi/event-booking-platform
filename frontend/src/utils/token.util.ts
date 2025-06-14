class TokenUtil {
  user_token() {
    if (localStorage.getItem('accessToken')) return true;
    return false;
  }

  admin_token() {
    if (localStorage.getItem('adminToken')) return true;
    return false;
  }

  getUsername(isAdmin: boolean) {
    if (isAdmin) {
    }
  }
}

export default new TokenUtil();
