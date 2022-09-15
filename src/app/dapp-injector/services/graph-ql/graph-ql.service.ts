import { Injectable } from '@angular/core';
import { Apollo, QueryRef, gql } from 'apollo-angular';
import { firstValueFrom, Subscription } from 'rxjs';
import { DappInjector } from '../../dapp-injector.service';
import { GET_SUMMARY, GET_USER } from './queryDefinitions';
import { GET_EVENTS, GET_PROFILES } from './querySuperFluid';

export interface ProfilesRequest {
  profileIds?: string[];
  ownedBy?: string;
  handles?: string[];
  whoMirroredPublicationId?: string;
}


@Injectable({
  providedIn: 'root',
})
export class GraphQlService {
  loading!: boolean;
  posts: any;
  postsQuery!: QueryRef<any>;
  constructor(private apollo: Apollo, public dapp:DappInjector) {}
  
  
  watchUser(address: string) {
    const variables = { address: address.toLowerCase() };
    return this.apollo.watchQuery<any>({
      query: gql(GET_USER),
      variables,
    }).valueChanges;
  }

  async querySummary():Promise<any> {
    try {
 
      const posts = await  this.apollo
      .query<any>({
        query: gql(GET_SUMMARY)
      }).toPromise()
        

     
      return posts;
    } catch (error) {
      console.log(error);
      return {};
    }

  }

  async querySuper() :Promise<any> {
    try {
 
      const posts = await  firstValueFrom(this.apollo.use('superfluid')
      .query<any>({
        query: gql(GET_EVENTS)
      }))
        
      return posts;
    } catch (error) {
      console.log(error);
      return {};
    }

  }


  async getProfilesRequest():Promise<any> {
    try {
    //  const variables:ProfilesRequest =  { ownedBy: this.dapp.signerAddress! }; 
      const variables = { address: "0x7A84b3CaAC4C00AFA0886cb2238dbb9788376581" };
      const profiles = await  firstValueFrom(this.apollo.use('lens')
      .query<any>({
        query: gql(GET_PROFILES),
        variables
      }))
        
      return profiles;
    } catch (error) {
      console.log(error);
      return {};
    }

  }


}
