import { Injectable } from '@angular/core';
import * as Parse from 'parse';

@Injectable({
  providedIn: 'root'
})
export class User extends Parse.User {

  constructor() {
    super();
  }

  static getInstance() {
    return this;
  }

  static getCurrent() {
    return User.current() as User;
  }

  isLoggedInViaPassword() {
    return !this.authData;
  }

  loginAnonymously(): Promise<User> {
    return Parse.Cloud.run('createAnonymousUser');
  }

  becomeWithSessionToken(sessionToken: string): Promise<any> {
    return User.become(sessionToken);
  }

  loginWith(provider: string, authData: any = {}, extraData: any = {}): Promise<User> {
    const user: any = new User;
    user.set(extraData);
    return user._linkWith(provider, authData);
  }

  loginViaFacebook(): Promise<User> {
    return (Parse.FacebookUtils.logIn(null) as any);
  }

  isFacebookLinked(): boolean {
    return Parse.FacebookUtils.isLinked(Parse.User.current());
  }

  signIn(data: any = {}): Promise<User> {
    const user = new User;
    user.username = data.username;
    user.password = data.password;
    return user.logIn();
  }

  recoverPassword(email: string) {
    return Parse.User.requestPasswordReset(email);
  }

  logout() {
    return Parse.User.logOut();
  }

  get name(): string {
    return this.get('name');
  }

  set name(val) {
    this.set('name', val);
  }

  get email(): string {
    return this.get('email');
  }

  set email(val) {
    this.set('email', val);
  }

  get phone(): string {
    return this.get('phone');
  }

  set phone(val) {
    this.set('phone', val);
  }

  get username(): string {
    return this.get('username');
  }

  set username(val) {
    this.set('username', val);
  }

  get password(): string {
    return this.get('password');
  }

  set password(val) {
    this.set('password', val);
  }

  get authData(): any {
    return this.get('authData');
  }

  set authData(val) {
    this.set('authData', val);
  }

  get photo(): any {
    return this.get('photo');
  }

  set photo(val) {
    this.set('photo', val);
  }

  get contactEmail(): string {
    return this.get('contactEmail');
  }

}

Parse.Object.registerSubclass('_User', User);
