import { Injectable } from '@angular/core';
import { Apollo, QueryRef, gql } from 'apollo-angular';
import { utils } from 'ethers';
import { firstValueFrom, Subscription } from 'rxjs';
import { DappInjector } from '../../dapp-injector.service';
import { GET_AAVE_DATA } from './queryAave';
import {
  GET_CHARTS,
  GET_CREDIT,
  GET_CREDITS,
  GET_FULL_TEXT,
  GET_MEMBER,
  GET_MEMBER_CREDITS,
  GET_POOL,
  GET_SUMMARY,
} from './queryFloowdy';
import { GET_PROFILE, GET_PROFILES } from './queryLens';

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
  constructor(private apollo: Apollo, public dapp: DappInjector) {}

  watchMember(address: string) {
    const variables = { address: address.toLowerCase() };
    return this.apollo.watchQuery<any>({
      query: gql(GET_MEMBER),
      variables,
      pollInterval: 500,
    }).valueChanges;
  }

  watchPool() {
    return this.apollo
      .watchQuery<any>({
        query: gql(GET_POOL),
      pollInterval: 500,
      })
      .valueChanges
  }

  async querySummary(): Promise<any> {
    try {
      const posts = await this.apollo
        .query<any>({
          query: gql(GET_SUMMARY),
        })
        .toPromise();

      return posts;
    } catch (error) {
      console.log(error);
      return {};
    }
  }

  async getFullSearchCredit(id: string): Promise<any> {
    try {
      //  const variables:ProfilesRequest =  { ownedBy: this.dapp.signerAddress! };
      const variables = { value: id }; //"0x7A84b3CaAC4C00AFA0886cb2238dbb9788376581" };
      const profiles = await firstValueFrom(
        this.apollo.query<any>({
          query: gql(GET_FULL_TEXT),
          variables,
        })
      );

      return profiles;
    } catch (error) {
      console.log(error);
      return {};
    }
  }

  watchCharts() {
       return this.apollo.watchQuery<any>({
        query: gql(GET_CHARTS),
        pollInterval: 500
      }).valueChanges
}


  watchCredit(id: string) {
      const variables = { value: id }; //"0x7A84b3CaAC4C00AFA0886cb2238dbb9788376581" };
       return this.apollo.watchQuery<any>({
          query: gql(GET_CREDIT),
          variables,
          pollInterval: 500
        }).valueChanges
  }

  async getCredits(): Promise<any> {
    try {
      //  const variables:ProfilesRequest =  { ownedBy: this.dapp.signerAddress! };
      const variables = { address: '1' }; //"0x7A84b3CaAC4C00AFA0886cb2238dbb9788376581" };
      const profiles = await firstValueFrom(
        this.apollo.query<any>({
          query: gql(GET_CREDITS),
          variables,
        })
      );

      return profiles;
    } catch (error) {
      console.log(error);
      return {};
    }
  }


  ///// AAVE QUERIES
  async getReserveData(): Promise<any> {
    try {

      const profiles = await firstValueFrom(
        this.apollo.use('aave').query<any>({
          query: gql(GET_AAVE_DATA)
        })
      );

      return profiles;
    } catch (error) {
      console.log(error);
      return {};
    }
  }


  ///// LENS QUERIES

  async getMockProfile(): Promise<any> {
    try {
      let randomDecId = Math.floor(Math.random()*100)+1;
      let id = utils.hexlify(randomDecId)
      const variables = {
        id
      }; //"0x7A84b3CaAC4C00AFA0886cb2238dbb9788376581" };
      const profiles = await firstValueFrom(
        this.apollo.use('lens').query<any>({
          query: gql(GET_PROFILE),
          variables,
        })
      );

      return profiles;
    } catch (error) {
      console.log(error);
      return {};
    }
  }

  async getProfilesRequest(address:string): Promise<any> {
    try {
      //  const variables:ProfilesRequest =  { ownedBy: this.dapp.signerAddress! };
      const variables = {
        address,
      }; //;//"0xD28E808647D596F33Dcc3436E193A9566fc7aC07"}//
      const profiles = await firstValueFrom(
        this.apollo.use('lens').query<any>({
          query: gql(GET_PROFILES),
          variables,
        })
      );

      return profiles;
    } catch (error) {
      console.log(error);
      return {};
    }
  }
}
