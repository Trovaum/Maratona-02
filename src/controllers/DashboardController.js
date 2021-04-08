const Job = require("../model/Job")
const Profile = require("../model/Profile")
const JobUtils = require("../utils/JobUtils")

module.exports = {
    async index(req, res) {
        const jobs = await Job.get()
        const profile = await Profile.get()

        //ajustar o status dinamicamente
        let statusCount = {
            progress: 0,
            done: 0,
            total: jobs.length
        }

        let jobTotalHours = 0

        const updatedJobs = jobs.map((job) => {
            // ajustes no job
            const remaining = JobUtils.daysToCompleteJob(job)
            const status = remaining <= 0 ? 'done' : 'progress'

            //somando no statusCount 
            statusCount[status] += 1

            //somando o total de horas 
            jobTotalHours = status == 'progress' ? jobTotalHours +  Number(job['daily-hours']) : jobTotalHours  
            
            return {
                ...job,
                remaining,
                status,
                budget: JobUtils.calculateBudget(job, profile["value-hour"])
            }
        })

        //calculo deo freeHor
        //Quantidade de horas que quero trabalhar por dia (Profile)
        //subtrair a quantidade de horas/dia de cada job em progress
        const freeHours = profile["hours-per-day"] - jobTotalHours
        
        return res.render("index", 
            { 
                jobs: updatedJobs, 
                profile: profile, 
                statusCount: statusCount,
                freeHours: freeHours
             })
    }
}

