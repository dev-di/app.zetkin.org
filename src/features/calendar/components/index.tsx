import { Box } from '@mui/system';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { Suspense, useEffect, useState } from 'react';

import CalendarDayView from './CalendarDayView';
import CalendarMonthView from './CalendarMonthView';
import CalendarNavBar from './CalendarNavBar';
import CalendarWeekView from './CalendarWeekView';
import CampaignActivitiesModel from 'features/campaigns/models/CampaignActivitiesModel';
import useModel from 'core/useModel';
import ZUIFuture from 'zui/ZUIFuture';
import { getActivitiesByDay, getFutureDays, getPreviousDay } from './utils';

import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

export enum TimeScale {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
}

function getTimeScale(timeScaleStr: string) {
  let timeScale = TimeScale.MONTH;
  if (
    timeScaleStr !== undefined &&
    Object.values(TimeScale).includes(timeScaleStr as TimeScale)
  ) {
    timeScale = timeScaleStr as TimeScale;
  }
  return timeScale;
}

function getDateFromString(focusDateStr: string) {
  let date = new Date();
  if (focusDateStr) {
    const d = dayjs.utc(focusDateStr);
    if (d.isValid()) {
      date = d.toDate();
    }
  }
  return date;
}

const Calendar = () => {
  const router = useRouter();

  const orgId = router.query.orgId;

  const focusDateStr = router.query.focusDate as string;
  const [focusDate, setFocusDate] = useState(getDateFromString(focusDateStr));

  const timeScaleStr = router.query.timeScale as string;
  const [selectedTimeScale, setSelectedTimeScale] = useState<TimeScale>(
    getTimeScale(timeScaleStr)
  );

  useEffect(() => {
    setFocusDate(getDateFromString(focusDateStr));
  }, [focusDateStr]);

  useEffect(() => {
    setSelectedTimeScale(getTimeScale(timeScaleStr));
  }, [timeScaleStr]);

  useEffect(() => {
    router.query.focusDate = dayjs(focusDate).format('YYYY-MM-DD');
    router.query.timeScale = selectedTimeScale;
    router.push(router, undefined, { shallow: true });
  }, [focusDate, selectedTimeScale]);

  function navigateTo(timeScale: TimeScale, date: Date) {
    setSelectedTimeScale(timeScale);
    setFocusDate(date);
  }

  const model = useModel(
    (env) => new CampaignActivitiesModel(env, parseInt(orgId as string))
  );

  return (
    <ZUIFuture future={model.getAllActivities()}>
      {(data) => {
        const activitiesByDay = getActivitiesByDay(data);
        const futureDays = getFutureDays(activitiesByDay, focusDate);
        const lastDayWithEvent = getPreviousDay(activitiesByDay, focusDate);

        return (
          <Box
            display="flex"
            flexDirection="column"
            height={'100%'}
            padding={2}
          >
            <CalendarNavBar
              focusDate={focusDate}
              onChangeFocusDate={(date) => {
                setFocusDate(date);
              }}
              onChangeTimeScale={(timeScale) => {
                setSelectedTimeScale(timeScale);
              }}
              onStepBackward={() => {
                // Steps back to the last day with an event on day view
                if (selectedTimeScale === TimeScale.DAY && lastDayWithEvent) {
                  setFocusDate(lastDayWithEvent[0]);
                } else {
                  setFocusDate(
                    dayjs(focusDate).subtract(1, selectedTimeScale).toDate()
                  );
                }
              }}
              onStepForward={() => {
                // Steps forward to the next day with an event on day view
                if (selectedTimeScale === TimeScale.DAY && lastDayWithEvent) {
                  setFocusDate(new Date(futureDays[1][0]));
                } else {
                  setFocusDate(
                    dayjs(focusDate).add(1, selectedTimeScale).toDate()
                  );
                }
              }}
              orgId={parseInt(orgId as string)}
              timeScale={selectedTimeScale}
            />

            <Box
              display="flex"
              flexDirection="column"
              flexGrow={1}
              marginTop={2}
              overflow="auto"
            >
              <Suspense>
                {selectedTimeScale === TimeScale.DAY && (
                  <CalendarDayView
                    activities={futureDays}
                    focusDate={focusDate}
                    onClickPreviousDay={(date) => setFocusDate(date)}
                    previousActivityDay={lastDayWithEvent}
                  />
                )}
                {selectedTimeScale === TimeScale.WEEK && (
                  <CalendarWeekView
                    focusDate={focusDate}
                    onClickDay={(date) => navigateTo(TimeScale.DAY, date)}
                  />
                )}
                {selectedTimeScale === TimeScale.MONTH && (
                  <CalendarMonthView
                    focusDate={focusDate}
                    onClickDay={(date) => navigateTo(TimeScale.DAY, date)}
                    onClickWeek={(date) => navigateTo(TimeScale.WEEK, date)}
                  />
                )}
              </Suspense>
            </Box>
          </Box>
        );
      }}
    </ZUIFuture>
  );
};

export default Calendar;
