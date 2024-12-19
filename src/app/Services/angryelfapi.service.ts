import { Injectable } from "@angular/core";
import { IAngryElfAPIService } from "./angryelfapi.service.interface";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { retry, catchError, throwError } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class AngryElfAPI implements IAngryElfAPIService {

  constructor(private http: HttpClient) {
  }

  SendWinInfo(level: number, health: number, version: number, grid: any): void {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let body = { Level: level, Health: health, Version: version, Grid: grid };
    let json = JSON.stringify(body);
    this.http.post(`https://api.angryelfgames.com/TowerDefense/InputWinInfo`, body, httpOptions).subscribe({
      next: (result) => {
        //console.log(result);
      },
      error: (err) => {
        //console.log(err);

      }
    })
  }
}
