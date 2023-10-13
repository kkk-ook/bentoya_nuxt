<template>
  <div class='app'>
    <SuccessFlash class="successMessage"></SuccessFlash>
    <ErrorFlash :errorMessages="errorMessages" class="errorMessage"></ErrorFlash>
    <FullCalendar :options='calendarOptions'/>
  </div>
</template>

<script>
import FullCalendar, { Calendar } from '@fullcalendar/vue'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/daygrid'

export default {
  components: {
    FullCalendar
  },
  data() {
    return {
      calendarOptions: {
        plugins: [interactionPlugin, timeGridPlugin],
        initialView: 'dayGridMonth',
        locale: 'ja',
        weekends: true,
        nowIndicator: true,
        editable: true,
        selectable: true,
        buttonText: {
          today: '今日',
        },
        events: [],
        dateClick: this.handleDateClick,
      },
      holidays: [],
      errorMessages: [],
    }
  },
  async mounted() {
    // ①APIで休日を取得
    this.holidays = await this.$adminApi.getHolidays(
      this.$dayjs().format("YYYYMMDD")
    );
    // ②休日をカレンダー用に変換
    // this.currentHolidays = this.strIns(this.holidays);
    // ③変換された休日をマッピング
    let events = this.mapping(this.holidays);
    this.calendarOptions.events = events;
  },
  methods: {
    mapping(mapHolidays){
      let events = [];
      for(let obj of mapHolidays){
        let event = {
          title: "休日",
          start: obj.holiday_date,
        }
        events.push(event);
      }
      return events;
    },
    async handleDateClick(arg){
      this.errorMessages = [];
      // ①選択した該当日に休日があるか判定
      let object = this.holidays.find(obj => {
        if(obj.holiday_date == arg.dateStr){
          return obj
        }
      })
      if(object){
        const date = this.$dayjs(arg.dateStr).format('YYYY年M月D日');
        // ②コンファームを出す
        const result = confirm(date + "休日を削除しますか？");
        // ③休日を削除
        if(result){
          const success = await this.$adminApi.deleteHoliday(object.id);
          // ④イベントから削除
          if(success){
            this.holidays = await this.$adminApi.getHolidays(
              this.$dayjs().format("YYYYMMDD")
            );
            const events = this.mapping(this.holidays);
            this.calendarOptions.events = events;
            this.$showSuccessMessage("休日を削除しました");
          }
        }

      } else {
          const date = this.$dayjs(arg.dateStr).format('YYYY年M月D日');
          // ②コンファームを出す
          const result = confirm(date + "休日に設定しますか？");
          // ③休日をポスト
        if(result){
          let holidays = arg.dateStr;
          const success = await this.$adminApi.postHoliday(holidays);
          // ④イベントに追加
          if(success){
            this.holidays = await this.$adminApi.getHolidays(
              this.$dayjs().format("YYYYMMDD")
            );
            const events = this.mapping(this.holidays);
            this.calendarOptions.events = events;
          }
        } 
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.app {

  font-size: 8px;
}
::deep table{
  background-color: #fff;
}

::deep .fc-header-toolbar {
  //display: none !important;
  margin-bottom: 5px!important;
}

</style>
