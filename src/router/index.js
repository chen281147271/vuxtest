import Vue from 'vue'
import Router from 'vue-router'
import QueryAtt from '../components/QueryAtt'
import ValidateATT from'../components/test'
import HelloWorldVux from'../components/HelloFromVux'
import userinfo from'../components/userinfo'
 let routes= [
   {
     path: '/',
     component: HelloWorldVux,
     name: 'HelloWorldVux',
     children:[
     {
       path: '/',
       component: QueryAtt,
       name: 'QueryAtt'
     },
     {
       path: '/ValidateATT',
       component: ValidateATT,
       name: 'ValidateATT'
     },
       {
         path: '/userinfo',
         component: userinfo,
         name: 'userinfo'
       }
   ]

   }

  ]
export  default routes
