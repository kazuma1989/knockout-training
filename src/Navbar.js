export default class Navbar {
  isActive(pathname) {
    return pathname === window.location.pathname;
  }
}
