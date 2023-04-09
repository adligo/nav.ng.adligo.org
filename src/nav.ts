/**
  * Copyright 2023 Adligo Inc / Scott Morgan
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *     http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */
import { RouterModule, Route } from '@angular/router';

export type I_StringSupplier = () => string;

/**
 * A navigation element, like a Angular Route but with
 * the label provided by i18n or simple hard coded supplier.
 */
export interface I_Nav {
  /**
   * Following the pattern set by Route in @angular/router
   */
  children?: Array<I_Nav>;
  component: any;
  /**
   * The i18n Label to show the user in the html
   */
  label?: I_StringSupplier;
  path: string;
  /**
   * if this route is to be shown in the menu,
   * assume true if not present
   */
  visible?: boolean;
}
export type I_Navs = I_Nav[];

let emptyStringSupplier = () => '';

/**
 * A immutable implementation of I_Nav, like a Angular Route but with
 * the label provided by i18n or simple hard coded supplier.
 */
export class Nav implements I_Nav {
  children?: Array<Nav>;
  component: any;
  label?: I_StringSupplier = emptyStringSupplier;
  path: string = '';
  visible: boolean = false;

  constructor(route: I_Nav) {
    if (route.children != undefined && route.children.length >= 1) {
      let children2 : Array<Nav> = [];
      route.children.forEach(c => {
        children2.push(new Nav(c));
      }); 
      this.children = children2;
    }
    this.component = route.component;
    this.label = route.label;
    this.path = route.path;
    if (route.visible != undefined && !route.visible) {
      this.visible = false;
    } else {
      this.visible = true;
    }
  }
  /**
   * This method creates a Angular Route from
   * the enhanced Nav information, which add's the
   * label text and visible flag.
   * @returns 
   */
  public toRoute(): Route {
    if (this.children != undefined) {
      let cr : Route[] = []
      this.children.forEach(c => cr.push(c.toRoute()));
      return { component: this.component, children: cr, path: this.path};  
    } 
    return { component: this.component, path: this.path};
  }

  public toString(): string {
    return this.toStringIn(0);
  }

  private toStringIn(indent: number): string {
    var tabs = "";
    for (var i=0; i<indent; i++) {
      tabs = tabs + "/t";
    }
    var r = tabs + "Route [component: " + this.component + " label: " + 
      this.label  + ", path: " + this.path + ", visible: " + 
      this.visible;
    if (this.children != undefined) {
      this.children.forEach(c => {
        r= r + c.toStringIn(indent + 1);
      });
      r = r + "\n";
    }
    return r  + tabs + "]\n";
  }
}
export type Navs = Nav[];

/**
 * This function converts the I_Navs into an array of Angular Routes.
 * @param menuRoutes 
 * @returns 
 */
export function toRoutes(menuRoutes: I_Navs): Route[] {
  let routes : Route[] = [];
  menuRoutes.forEach(r => routes.push(new Nav(r).toRoute()));
  return routes;
}


