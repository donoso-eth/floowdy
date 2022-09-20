import { Injectable, ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GraphQlService } from './graph-ql.service';
import {Apollo, ApolloModule, APOLLO_NAMED_OPTIONS, APOLLO_OPTIONS, NamedOptions} from 'apollo-angular';
import {HttpLink} from 'apollo-angular/http';
import {InMemoryCache} from '@apollo/client/core';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ApolloModule
  ]
})
export class GraphQlModule {
  static forRoot(config:{uri:string}): ModuleWithProviders<GraphQlModule> {
    console.log(config.uri);
    return {
      ngModule: GraphQlModule,
      providers: [GraphQlService,
        {
          provide: APOLLO_NAMED_OPTIONS, // <-- Different from standard initialization
          useFactory(httpLink: HttpLink): NamedOptions {
            return {
              default: /* <-- this settings will be saved as default client */ {
                cache: new InMemoryCache(),
                link: httpLink.create({
                  uri: config.uri,
                }),
              },
              superfluid: /* <-- these settings will be saved by name: superfluid*/ {
                cache: new InMemoryCache(),
                link: httpLink.create({
                  uri: config.uri,
                  //uri: 'https://api.thegraph.com/subgraphs/name/superfluid-finance/protocol-v1-goerli',
                }),
              },
              lens: /* <-- these settings will be saved by name: lens*/ {
                cache: new InMemoryCache(),
                link: httpLink.create({
                  uri: 'https://api.lens.dev',
                }),
              },
            };
          },
          deps: [HttpLink],
        },],
    };
  }
 }
