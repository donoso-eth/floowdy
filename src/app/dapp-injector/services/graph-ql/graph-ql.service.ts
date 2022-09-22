import { Injectable } from '@angular/core';
import { Apollo, QueryRef, gql } from 'apollo-angular';
import { firstValueFrom, Subscription } from 'rxjs';
import { DappInjector } from '../../dapp-injector.service';
import { GET_CREDIT, GET_CREDITS, GET_MEMBER, GET_MEMBER_CREDITS, GET_POOL, GET_SUMMARY} from './queryDefinitions';
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
  
  
  watchMember(address: string) {
    const variables = { address: address.toLowerCase() };
    return this.apollo.use("superfluid").watchQuery<any>({
      query: gql(GET_MEMBER),
      variables,
      fetchPolicy: 'network-only' 
    }).valueChanges;
  }

  watchPool() {

    this.apollo.use("superfluid").watchQuery<any>({
      query: gql(GET_POOL),
    }).valueChanges.subscribe((val:any)=> console.log (val) )
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
  

  

  async getCredit(id:string):Promise<any> {
    try {
    //  const variables:ProfilesRequest =  { ownedBy: this.dapp.signerAddress! }; 
      const variables = { value:id}//"0x7A84b3CaAC4C00AFA0886cb2238dbb9788376581" };
      const profiles = await  firstValueFrom(this.apollo.use('superfluid')
      .query<any>({
        query: gql(GET_CREDIT),
        variables
      }))
        
      return profiles;
    } catch (error) {
      console.log(error);
      return {};
    }
  }

  async getCredits():Promise<any> {
    try {
    //  const variables:ProfilesRequest =  { ownedBy: this.dapp.signerAddress! }; 
      const variables = { address:"1"}//"0x7A84b3CaAC4C00AFA0886cb2238dbb9788376581" };
      const profiles = await  firstValueFrom(this.apollo.use('superfluid')
      .query<any>({
        query: gql(GET_CREDITS),
        variables
      }))
        
      return profiles;
    } catch (error) {
      console.log(error);
      return {};
    }
  }
    async getMemberCredits():Promise<any> {
      try {
      //  const variables:ProfilesRequest =  { ownedBy: this.dapp.signerAddress! }; 
        const variables = { address:"1"}//"0x7A84b3CaAC4C00AFA0886cb2238dbb9788376581" };
        const profiles = await  firstValueFrom(this.apollo.use('superfluid')
        .query<any>({
          query: gql(GET_MEMBER_CREDITS),
          variables
        }))
          
        return profiles;
      } catch (error) {
        console.log(error);
        return{}
      }

  }


  async getProfilesRequest():Promise<any> {
    try {
    //  const variables:ProfilesRequest =  { ownedBy: this.dapp.signerAddress! }; 
      const variables = { address:"0x7A84b3CaAC4C00AFA0886cb2238dbb9788376581"}//"0x7A84b3CaAC4C00AFA0886cb2238dbb9788376581" };
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
