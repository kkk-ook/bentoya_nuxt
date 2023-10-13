import { Calendar } from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import jaLocale from '@fullcalendar/core/locales/ja' // 日本語に対応させるために読み込む
export default function (context) {
  if (document.querySelector('#calendar')) {
    document.addEventListener('DOMContentLoaded', function () {
      const calendarEl = document.querySelector('#calendar')
      const calendar = new Calendar(calendarEl, {
        locale: jaLocale,
        height: 625,
        events: context.store.state.events,
        plugins: [dayGridPlugin, momentPlugin, timeGridPlugin, interactionPlugin],
        defaultView: 'dayGridMonth',
        editable: true,
        selectable: true,
        selectHelper: true,
        ignoreTimezone: false,
        header: {
          left: 'today prev,next',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        eventLimit: true,
        firstDay: 0,
        weekends: true,
        weekMode: 'fixed',
        weekNumbers: false,
        slotDuration: '00:30:00',
        snapDuration: '00:15:00',
        allDaySlot: false,
        allDayText: 'allday',
        slotMinutes: 15,
        snapMinutes: 15,
        slotLabelFormat: 'H:mm',
        firstHour: 9,
        defaultTimedEventDuration: '10:00:00',
        axisFormat: 'H:mm',
        timeFormat: 'H:mm',
        minTime: '00:00:00',
        maxTime: '24:00:00',
        buttonText: {
          prev: '',
          next: '',
          prevYear: '',
          nextYear: ''
        },
        eventClick: function (info) {
          alert('Event: ' + info.event.title)
          alert('Coordinates: ' + info.jsEvent.pageX + ',' + info.jsEvent.pageY)
          alert('View: ' + info.view.type)
          // change the border color just for fun
          info.el.style.borderColor = 'red'
        },
        dateClick: function (info) {
          alert('Clicked on: ' + info.dateStr)
          alert('Coordinates: ' + info.jsEvent.pageX + ',' + info.jsEvent.pageY)
          alert('Current view: ' + info.view.type)
          info.dayEl.style.backgroundColor = 'red'
        }
      })

      calendar.render()
    })
  }
}
