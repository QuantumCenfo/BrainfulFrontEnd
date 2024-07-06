import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { ICard } from '../interfaces';
import { tap, map, delay } from "rxjs/operators";
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MemoryService {

}
