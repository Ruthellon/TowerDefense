import { Injectable } from "@angular/core";
import { IAngryElfAPIService } from "./angryelfapi.service.interface";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { retry, catchError, throwError, firstValueFrom } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class AngryElfAPI implements IAngryElfAPIService {

  constructor(private http: HttpClient) {
  }

  async Login(username: string, password: string): Promise<boolean> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let body = { username: username, password: password };

    console.log(body);
    this.http.post(`https://api.angryelfgames.com/api/Authorization/Login`, body, httpOptions).subscribe({
      next: (result: any) => {
        console.log(result);
      },
      error: (err: any) => {
        console.log(err);
      }
    });

    const response = await firstValueFrom(
      this.http.post<{ isLoggedIn: boolean }>(`https://api.angryelfgames.com/api/Authorization/Login`, body, httpOptions)
    );

    return response.isLoggedIn;
  }

  SendWinInfo(level: number, health: number, version: string, grid: any): void {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let body = { Level: level, Health: health, Version: version, Grid: grid };
    let json = JSON.stringify(body);

    this.http.post(`https://api.angryelfgames.com/TowerDefense/InputWinInfo`, body, httpOptions).subscribe({
      next: (result: any) => {
        //console.log(result);
      },
      error: (err: any) => {
        //console.log(err);
      }
    });
  }
}
