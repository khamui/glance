import { inject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';

@inject(HttpClient)
export class Api {
  constructor(HttpClient) {
    this.http = HttpClient;
    const baseUrl = 'http://localhost:1337';
    HttpClient.configure(config => config.withBaseUrl(baseUrl));
  }

  get(resourcetype) {
    return this.http.fetch('/' + resourcetype)
      .then(response => {
        return response.json();
      })
      .then(data => {
        return data;
      });
  }
}
