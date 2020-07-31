import moment from 'moment-timezone';

import { getTasks, getLists, addTask, removeTask } from '../../api/google-tasks/tasks';

import { GET_TARGETS, GET_CATEGORIES, GET_TIMER_HISTORY, GET_TOTAL_TIME, GET_WEEK_TARGETS, GET_COLOR_THEME } from '../queries/tasks';

const googleTaskIds = { 'day': 'Nm10QWpKQzFzcUFXUXBaag', 'week': 'NE1GMnFnWFBUbGVtc2JwVQ', 'month': '' }
const listQuery = { 'week': GET_WEEK_TARGETS }

export const Mutation = {
    addTarget: async (_, variables, { cache }) => {
        console.log('addTarget - ', variables)
        let list = variables.list;
        let task = await addTask({ tasklist: googleTaskIds[list || 'day'], title: variables.title, due: variables.day || moment().endOf(list || 'day') })
        console.log('task, id, ', task, task.id,)
        if (list) {
            let targetsName = `${list}Targets`
            let targets = cache.readQuery({ query: listQuery[list] })[targetsName]
            let targetList = cache.readQuery({ query: listQuery[list] })[targetsName][moment().endOf(list)] || []

            cache.writeQuery({
                query: listQuery[list], data: { [targetsName]: { ...targets, [moment().endOf(list)]: [...targetList, { ...variables, googleId: task.id }] } },
            })
        }
        else {
            console.log('variables ', variables)
            let targets = cache.readQuery({ query: GET_TARGETS }).targets
            // console.log('variables ', targets)
            let targetList = cache.readQuery({ query: GET_TARGETS })['targets'][variables.date] || []

            cache.writeQuery({
                query: GET_TARGETS, data: { 'targets': { ...targets, [variables.date]: [...targetList, { ...variables, googleId: task.id }] } },
            })
        }
        return null;
    },
    removeTarget: (_, variables, { cache }) => {
        let targets = cache.readQuery({ query: GET_TARGETS }).targets
        let list = variables.list;
        console.log('variables ', variables);

        if (list) {
            let targetsName = `${list}Targets`
            let targets = cache.readQuery({ query: listQuery[list] })[targetsName]
            let targetList = cache.readQuery({ query: listQuery[list] })[targetsName][moment().endOf(list)] || []
            console.log('variables123 ', variables, targetList, targetList.find((item, index) => index === variables.id));
            removeTask({ tasklist: googleTaskIds[list || 'day'], task: targetList.find((item, index) => index === variables.id).googleId })

            cache.writeQuery({
                query: listQuery[list], data: { [targetsName]: { ...targets, [moment().endOf(list)]: targetList.filter((item, index) => index !== variables.id) } },
            })
        }
        else {
            let targets = cache.readQuery({ query: GET_TARGETS }).targets
            let targetList = cache.readQuery({ query: GET_TARGETS }).targets[variables.date] || []
            console.log('variebles 0')
            removeTask({ tasklist: googleTaskIds[list || 'day'], task: targetList.find((item, index) => index === variables.id).googleId })

            cache.writeQuery({
                query: GET_TARGETS, data: { targets: { ...targets, [variables.date]: targetList.filter((item, index) => index !== variables.id) } },
            })
        }
        return null;
    },
    addTask: (root, variables, { cache }) => {
        let list = variables.list;
        if (list) {
            let targetsName = `${list}Targets`
            let targets = cache.readQuery({ query: listQuery[list] })[targetsName]
            let targetList = cache.readQuery({ query: listQuery[list] })[targetsName][moment().endOf(list)] || []
            targetList = targetList.map((item, index) => index !== variables.id ? item : { ...item, tasks: [...item.tasks, { ...variables }] })

            console.log('variables ', variables);
            // cache.writeQuery({
            // 	query: listQuery[list], data: { targets: targets },
            // })
            cache.writeQuery({
                query: listQuery[list], data: { [targetsName]: { ...targets, [moment().endOf(list)]: targetList } },
            })
        }
        else {
            let targets = cache.readQuery({ query: GET_TARGETS }).targets
            let targetList = cache.readQuery({ query: GET_TARGETS }).targets[moment().endOf('day')] || []

            console.log('sdfsf', variables, targets)
            targetList = targetList.map((item, index) => index !== variables.id ? item : { ...item, tasks: [...item.tasks, { ...variables }] })

            cache.writeQuery({
                query: GET_TARGETS, data: { targets: { ...targets, [moment().endOf('day')]: targetList } },
            })
        }
        return null;
    },
    removeTask: (root, variables, { cache }) => {
        let list = variables.list
        if (list) {
            let targetsName = `${list}Targets`
            let targets = cache.readQuery({ query: listQuery[list] })[targetsName]
            let targetList = cache.readQuery({ query: listQuery[list] })[targetsName][moment().endOf(list)] || []
            targetList = targetList.map((item, index) => index !== variables.id ? item : { ...item, tasks: item.tasks.filter((_, taskIndex) => taskIndex !== variables.taskId) })
            cache.writeQuery({
                query: listQuery[list], data: { [targetsName]: { ...targets, [moment().endOf(list)]: targetList } },
            })
        }
        else {
            let targets = cache.readQuery({ query: GET_TARGETS }).targets
            let targetList = cache.readQuery({ query: GET_TARGETS }).targets[moment().endOf('day')] || []

            targetList = targetList.map((item, index) => index !== variables.id ? item : { ...item, tasks: item.tasks.filter((taskItem, taskIndex) => taskIndex !== variables.taskId) })
            cache.writeQuery({
                query: GET_TARGETS, data: { targets: { ...targets, [moment().endOf('day')]: targetList } },
            })
        }
        return null;
    },
    updateTask: (root, variables, { cache }) => {
        let list = variables.list;
        console.log('update ', variables)
        if (list) {
            let targetsName = `${list}Targets`
            let targets = cache.readQuery({ query: listQuery[list] })[targetsName]
            let targetList = cache.readQuery({ query: listQuery[list] })[targetsName][moment().endOf(list)] || []
            let tasks = targetList[variables.id].tasks

            tasks = tasks.map((task, taskIndex) => taskIndex !== variables.taskId ?
                task : { ...task, ...variables.checked !== undefined ? { checked: variables.checked } : { title: variables.title } })
            targetList = targetList.map((item, index) => index !== variables.id ? item : { ...item, tasks })

            cache.writeQuery({
                query: listQuery[list], data: { [targetsName]: { ...targets, [moment().endOf(list)]: targetList } },
            })
        }
        else {
            let targets = cache.readQuery({ query: GET_TARGETS }).targets
            let targetList = cache.readQuery({ query: GET_TARGETS }).targets[moment().endOf('day')] || []

            console.log('variables ', variables)
            targetList = targetList.map((item, index) =>
                index !== variables.id ?
                    item : {
                        ...item,
                        tasks: item.tasks.map((task, taskIndex) => taskIndex !== variables.taskId ?
                            task : { ...task, ...variables.checked !== undefined ? { checked: variables.checked } : { title: variables.title } })
                    })
            cache.writeQuery({
                query: GET_TARGETS, data: { targets: { ...targets, [moment().endOf('day')]: targetList } },
            })
        }
        return null;
    },
    addCategory: (_, variables, { cache }) => {
        let categories = cache.readQuery({ query: GET_CATEGORIES }).categories
        console.log('addCategory ', categories)
        cache.writeQuery({
            query: GET_CATEGORIES, data: { categories: { ...categories, [variables.title]: { ...variables } } },
        })
        return null;
    },
    removeCategory: (_, variables, { cache }) => {
        let categories = cache.readQuery({ query: GET_CATEGORIES }).categories
        // const title = variables.title;
        let { [variables.title]: __, ...newCategories } = categories;
        console.log('categories ', variables, categories);
        cache.writeQuery({
            query: GET_CATEGORIES, data: { categories: newCategories },
        })
        return null;
    },
    updateTotalTime: (_, variables, { cache }) => {
        let totalTime = cache.readQuery({ query: GET_TOTAL_TIME }).totalTime
        console.log('updateTOtaltime ', totalTime, variables)
        cache.writeQuery({
            query: GET_TOTAL_TIME, data: { totalTime: totalTime + variables.duration },
        })
        return null;
    },
    addTimer: (_, variables, { cache }) => {
        let timerHistory = cache.readQuery({ query: GET_TIMER_HISTORY }).timerHistory
        // console.log('addTimer ', categories)
        cache.writeQuery({
            query: GET_TIMER_HISTORY, data: { timerHistory: [...timerHistory, { ...variables }] },
        })
        return null;
    },
    setColorTheme: (_, variables, { cache }) => {
        // let timerHistory = cache.readQuery({ query: GET_TIMER_HISTORY }).timerHistory
        console.log('variables ', variables)
        cache.writeQuery({
            query: GET_COLOR_THEME, data: { colorTheme: variables.theme },
        })
        return null;
    },
};