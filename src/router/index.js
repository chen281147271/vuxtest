import Vue from 'vue'
import Router from 'vue-router'
import QueryAtt from '../components/QueryAtt'
import HelloWorld from'../components/test'
import HelloWorldVux from'../components/HelloFromVux'
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
       path: '/HelloWorld',
       component: HelloWorld,
       name: 'HelloWorld'
     }
   ]

   }

  ]
export  default routes
