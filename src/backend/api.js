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

  get(resourcetype) {
    return this.http.fetch('/' + resourcetype)
      .then(response => {
        return response.json();
      })
      .then(data => {
        // LOGGER: successful get
        data['type'] = resourcetype;
        return data;
      })
      .catch(() => { throw new Error('network error'); });
  }

  update(resourcetype, content) {
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
