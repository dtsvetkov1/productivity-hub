import { gql } from '@apollo/client';


export const ADD_TARGET = gql`
            mutation addTarget($title: String!, $start: String!, $end: String!, $category: String, $tasks: [Task], $list: String, $date: String) {
              addTarget(title: $title, start: $start, end: $end, category: $category, tasks: $tasks, list: $list, date: $date) @client
          }
        `

export const REMOVE_TARGET = gql`
            mutation removeTarget($id: Int!, $list: String,  $date: String) {
              removeTarget(id: $id, list: $list, date: $date) @client
          }
        `


export const ADD_TASK = gql`
            mutation addTask($title: String!, $checked: Boolean, $id: Int, $list: String,  $date: String) {
              addTask(title:$title, checked: $checked, id: $id, list: $list, date: $date) @client
          }
        `

export const REMOVE_TASK = gql`
            mutation removeTask($id: Int!, $taskId: Int!, $list: String) {
              removeTask(id: $id, taskId: $taskId, list: $list) @client
          }
        `

export const TOGGLE_TASK = gql`
            mutation toggleTask($id: Int!) {
              toggleTask(id: $id) @client
          }
        `

export const UPDATE_TASK = gql`
            mutation updateTask($id: Int!, $taskId: Int!, $title: String, $checked: Boolean, $list: String) {
              updateTask(id: $id, taskId: $taskId, title: $title, checked: $checked, list: $list) @client
          }
        `

export const ADD_CATEGORY = gql`
            mutation addCategory($title: String!, $color: String) {
              addCategory(title: $title, color: $color) @client
          }
        `

export const ADD_TIMER = gql`
            mutation addTimer($title: String!, $category: String, $start: String, $duration: Float) {
              addTimer(title: $title, category: $category, start: $start, duration: $duration) @client
          }
        `

export const UPDATE_TOTAL_TIME = gql`
            mutation updateTotalTime($duration: Float) {
              updateTotalTime(duration: $duration) @client
          }
        `

export const REMOVE_CATEGORY = gql`
        mutation removeCategory($title: String!) {
          removeCategory(title: $title) @client
      }
    `


export const SET_COLOR_THEME = gql`
        mutation setColorTheme($theme: String!) {
          setColorTheme(theme: $theme) @client
        }
`
