import { inject, Factory } from 'aurelia-framework';
import { HttpClient, json } from 'aurelia-fetch-client';

@inject(Factory.of(HttpClient))
export class Api {
  constructor(http) {
    this.http = new http;
    const baseUrl = 'http://localhost:1337';
    this.http.configure(config => {
      config
        .useStandardConfiguration()
        .withBaseUrl(baseUrl)
        .withDefaults({
          credentials: 'same-origin',
          headers: {
            'X-Requested-With': 'Fetch'
          }
        });
    });
  }

  read(resource) {
    return this.http.fetch('/' + resource)
      .then(response => {
        return response.json();
      })
      .then(data => {
        // LOGGER: successful get
        return data;
      })
      .catch(() => { throw new Error('network error'); });
  }

  create(resourcetype, content) {
    return this.http.fetch('/' + resourcetype, {
      method: 'post',
      body: json(content)
    })
      .then(response => {
        return response;
      })
      .then(data => {
        // LOGGER: successful sent and saved
        console.log(data + ' sent!');
        return data;
      })
      // LOGGER: error saved
      .catch(() => { throw new Error('network error'); });
  }
}
