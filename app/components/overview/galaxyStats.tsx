"use client"
import { Card, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, CardHeader, CardBody, Image, Divider } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import { TrendChart } from './trendChart';
import useSWR from 'swr';
import { fetcher } from '@/app/classes/fetch';
import AnimatedNumber from "animated-number-react";
import { Assignment } from '@/app/types/api/helldivers/assignment_types';
import { ChartData } from './interfaces';

function GalaxyStatsCard(props: { className?: string, majorOrder: Assignment, time: number }) {

    //const [stats, setStats] = useState<Stats>();
    const [assignment, setAssignment] = useState<Assignment>();
    const [missionsWon, setmissionsWon] = useState(0);
    const [missionsLost, setmissionsLost] = useState(0);
    const [bugKills, setbugKills] = useState(0);
    const [automatonKills, setautomatonKills] = useState(0);
    const [bulletsFired, setbulletsFired] = useState(0);
    const [bulletsHit, setbulletsHit] = useState(0);
    const [timePlayed, settimePlayed] = useState(0);
    const [deaths, setdeaths] = useState(0);
    const [friendlies, setfriendlies] = useState(0);

    const [historicalStats, setHistoricalStats] = useState<ChartData>();

    const reqStats = useSWR("/api/status/stats", fetcher, { refreshInterval: 20000 }).data
    const reqHistory = useSWR("/api/historical/stats/from/" + props.time, fetcher, { refreshInterval: 20000 }).data

    //console.log(missionsWon)

    useEffect(() => {
        //console.log(reqStats)
        if (reqStats != undefined && props.majorOrder != undefined && reqHistory != undefined) {
            setAssignment(props.majorOrder)
            //console.log(reqStats.data)
            //setStats(reqStats)
            setmissionsWon(reqStats.galaxy_stats.missionsWon)
            setmissionsLost(reqStats.galaxy_stats.missionsLost)
            setbugKills(reqStats.galaxy_stats.bugKills)
            setautomatonKills(reqStats.galaxy_stats.automatonKills)
            setbulletsFired(reqStats.galaxy_stats.bulletsFired)
            setbulletsHit(reqStats.galaxy_stats.bulletsHit)
            settimePlayed(reqStats.galaxy_stats.timePlayed)
            setdeaths(reqStats.galaxy_stats.deaths)
            setfriendlies(reqStats.galaxy_stats.friendlies)

            let tmpTrend: ChartData = {
                missionSuccessRate: [],
                deaths: [],
                revives: [],
                missionsWon: [],
                timePlayed: [],
                automatonKills: [],
                illuminateKills: [],
                missionsLost: [],
                bulletsFired: [],
                friendlies: [],
                bulletsHit: [],
                accurracy: [],
                bugKills: [],
                missionTime: []
            };


            for (let i = 1; i < reqHistory.length; i++) {

                tmpTrend.missionSuccessRate.push({ value: reqHistory[i].missionSuccessRate - reqHistory[i - 1].missionSuccessRate, created: reqHistory[i].created })
                tmpTrend.deaths.push({ value: reqHistory[i].deaths - reqHistory[i - 1].deaths, created: reqHistory[i].created })
                tmpTrend.revives.push({ value: reqHistory[i].revives - reqHistory[i - 1].revives, created: reqHistory[i].created })
                tmpTrend.missionsWon.push({ value: reqHistory[i].missionsWon - reqHistory[i - 1].missionsWon, created: reqHistory[i].created })
                tmpTrend.timePlayed.push({ value: reqHistory[i].timePlayed - reqHistory[i - 1].timePlayed, created: reqHistory[i].created })
                tmpTrend.automatonKills.push({ value: reqHistory[i].automatonKills - reqHistory[i - 1].automatonKills, created: reqHistory[i].created })
                tmpTrend.illuminateKills.push({ value: reqHistory[i].illuminateKills - reqHistory[i - 1].illuminateKills, created: reqHistory[i].created })
                tmpTrend.missionsLost.push({ value: reqHistory[i].missionsLost - reqHistory[i - 1].missionsLost, created: reqHistory[i].created })
                tmpTrend.bulletsFired.push({ value: reqHistory[i].bulletsFired - reqHistory[i - 1].bulletsFired, created: reqHistory[i].created })
                tmpTrend.friendlies.push({ value: reqHistory[i].friendlies - reqHistory[i - 1].friendlies, created: reqHistory[i].created })
                tmpTrend.bulletsHit.push({ value: reqHistory[i].bulletsHit - reqHistory[i - 1].bulletsHit, created: reqHistory[i].created })
                tmpTrend.accurracy.push({ value: reqHistory[i].accurracy - reqHistory[i - 1].accurracy, created: reqHistory[i].created })
                tmpTrend.bugKills.push({ value: reqHistory[i].bugKills - reqHistory[i - 1].bugKills, created: reqHistory[i].created })
                tmpTrend.missionTime.push({ value: reqHistory[i].missionTime - reqHistory[i - 1].missionTime, created: reqHistory[i].created })

            }

            setHistoricalStats(tmpTrend)
        }

    }, [props.majorOrder, reqStats, reqHistory])

    const formatValue = (value: number) => {
        return value.toLocaleString("en", { maximumFractionDigits: 0, useGrouping: true })
    };

    const formatTime = (value: number) => {
        return (value / 31556952).toLocaleString("en", { maximumFractionDigits: 0, useGrouping: true }) + " Years"
    }

    return (


        <div className={(props.className != undefined) ? props.className : ""}>
            <Card>
                <CardHeader className='flex-wrap items-center justify-center'>
                    <div className='flex flex-wrap items-start justify-center'>
                        <Image
                            src='/images/helldivers_skull.svg'
                            width={45}
                        />
                        <div className='w-full text-center subtitle'>Galaxy Stats</div>
                    </div>
                </CardHeader>
                <Divider className='mt-2' />
                <CardBody>
                    <Table aria-label="statsTable">
                        <TableHeader>
                            <TableColumn>Stat</TableColumn>
                            <TableColumn>Value</TableColumn>
                            <TableColumn>Trend</TableColumn>
                        </TableHeader>
                        <TableBody>
                            <TableRow key="1">
                                <TableCell>Missions Won</TableCell>
                                <TableCell><AnimatedNumber aria-label="missionsWon" value={missionsWon} formatValue={formatValue} duration={1100} /></TableCell>
                                <TableCell><TrendChart dataArray={historicalStats?.missionsWon}/></TableCell>
                            </TableRow>
                            <TableRow key="2">
                                <TableCell>Missions Lost</TableCell>
                                <TableCell><AnimatedNumber aria-label="missionsLost" value={missionsLost} formatValue={formatValue} duration={1100} /></TableCell>
                                <TableCell><TrendChart dataArray={historicalStats?.missionsLost}/></TableCell>
                            </TableRow>
                            <TableRow key="3">
                                <TableCell>Terminid Kills</TableCell>
                                <TableCell><AnimatedNumber aria-label="bugKills" value={bugKills} formatValue={formatValue} duration={1100} /></TableCell>
                                <TableCell><TrendChart dataArray={historicalStats?.bugKills}/></TableCell>
                            </TableRow>
                            <TableRow key="4">
                                <TableCell>Automaton Kills</TableCell>
                                <TableCell><AnimatedNumber aria-label="automatonKills" value={automatonKills} formatValue={formatValue} duration={1100} /></TableCell>
                                <TableCell><TrendChart dataArray={historicalStats?.automatonKills}/></TableCell>
                            </TableRow>
                            <TableRow key="5">
                                <TableCell>Bullets Fired</TableCell>
                                <TableCell><AnimatedNumber aria-label="bulletsFired" value={bulletsFired} formatValue={formatValue} duration={1100} /></TableCell>
                                <TableCell><TrendChart dataArray={historicalStats?.bulletsFired}/></TableCell>
                            </TableRow>
                            <TableRow key="6">
                                <TableCell>Bullets Hit</TableCell>
                                <TableCell><AnimatedNumber aria-label="bulletsHit" value={bulletsHit} formatValue={formatValue} duration={1100} /></TableCell>
                                <TableCell><TrendChart dataArray={historicalStats?.bulletsHit}/></TableCell>
                            </TableRow>
                            <TableRow key="7">
                                <TableCell>Time Played</TableCell>
                                <TableCell><AnimatedNumber aria-label="timePlayed" value={timePlayed} formatValue={formatTime} duration={1100} /></TableCell>
                                <TableCell><TrendChart dataArray={historicalStats?.timePlayed}/></TableCell>
                            </TableRow>
                            <TableRow key="8">
                                <TableCell>Deaths</TableCell>
                                <TableCell><AnimatedNumber aria-label="deaths" value={deaths} formatValue={formatValue} duration={1100} /></TableCell>
                                <TableCell><TrendChart dataArray={historicalStats?.deaths}/></TableCell>
                            </TableRow>
                            <TableRow key="9">
                                <TableCell>Friendly Kills</TableCell>
                                <TableCell><AnimatedNumber aria-label="friendlies" value={friendlies} formatValue={formatValue} duration={1100} /></TableCell>
                                <TableCell><TrendChart dataArray={historicalStats?.friendlies}/></TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>

                </CardBody>
            </Card>
        </div>
    )
}

export default GalaxyStatsCard