import { gql } from '@apollo/client';


export const GET_TARGETS = gql`
            query getTargets {
                targets @client
            }
        `

export const GET_TARGET = gql`
            query getMyTarget($id: Int) {
                getTarget(id: $id) @client 
            } 
        `

export const GET_TASKS = gql`
            query getTasks {
                tasks @client
            }
        `

export const GET_TASK = gql`
            query getTask($id: String) {
                tasks @client
            }
        `

export const GET_CATEGORIES = gql`
            query getCategories {
                categories @client
            }
        `


export const GET_TOTAL_TIME = gql`
            query getTotalTimer {
                totalTime @client
            }
        `

export const GET_TIMER_HISTORY = gql`
            query getTimerHistory {
                timerHistory @client
            }
        `

export const GET_WEEK_TARGETS = gql`
        query getWeekTargets {
            weekTargets @client
        }
    `

export const GET_WEEK_INFO = gql`
    query getWeekInfo {
        weekInfo @client
    }
`

export const GET_COLOR_THEME = gql`
    query getColorTheme {
        colorTheme @client
    }
`
