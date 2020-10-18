import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import * as MenuItem from '../../shared/menu-items/menu-items';
import { AuthService } from 'src/app/shared/services/auth/auth.service';

var misc: any = {
  sidebar_mini_active: true
};


export const ROUTES = MenuItem.PenyelarasRoutes
export const ROUTESUSER = MenuItem.KakitanganRoutes
export const ROUTESJABATAN = MenuItem.JabatanRoutes
export const ROUTESADMIN = MenuItem.AdminRoutes
// export const ROUTESKETUA = MenuItem.KetuaJabatanRoutes
// export const ROUTESPENGARAH = MenuItem.PengarahJabatanRoutes

export let menuBaru: number = 1

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"]
})
export class SidebarComponent implements OnInit {
  public menuItems: any[];
  public isCollapsed = true;
  public menuNew: number = 1

  constructor(private router: Router, public authService: AuthService) {}

  ngOnInit() {
    if (this.authService.userRole == 1) {
      this.menuItems = ROUTES.filter(menuItem => menuItem)
    }
    else if (this.authService.userRole == 2) {
      this.menuItems = ROUTESUSER.filter(menuItem => menuItem)
    }
    else if (this.authService.userRole == 3) {
      this.menuItems = ROUTESJABATAN.filter(menuItem => menuItem)
    }
    else if (this.authService.userRole == 4) {
      this.menuItems = ROUTESADMIN.filter(menuItem => menuItem)
    }
    // else if (this.authService.userRole == 5) {
    //   this.menuItems = ROUTESKETUA.filter(menuItem => menuItem)
    // }
    // else if (this.authService.userRole == 6) {
    //   this.menuItems = ROUTESPENGARAH.filter(menuItem => menuItem)
    // }
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
    });
  }
  onMouseEnterSidenav() {
    if (!document.body.classList.contains("g-sidenav-pinned")) {
      document.body.classList.add("g-sidenav-show");
    }
  }
  onMouseLeaveSidenav() {
    if (!document.body.classList.contains("g-sidenav-pinned")) {
      document.body.classList.remove("g-sidenav-show");
    }
  }
  minimizeSidebar() {
    const sidenavToggler = document.getElementsByClassName(
      "sidenav-toggler"
    )[0];
    const body = document.getElementsByTagName("body")[0];
    if (body.classList.contains("g-sidenav-pinned")) {
      misc.sidebar_mini_active = true;
    } else {
      misc.sidebar_mini_active = false;
    }
    if (misc.sidebar_mini_active === true) {
      body.classList.remove("g-sidenav-pinned");
      body.classList.add("g-sidenav-hidden");
      sidenavToggler.classList.remove("active");
      misc.sidebar_mini_active = false;
    } else {
      body.classList.add("g-sidenav-pinned");
      body.classList.remove("g-sidenav-hidden");
      sidenavToggler.classList.add("active");
      misc.sidebar_mini_active = true;
    }
  }
}
