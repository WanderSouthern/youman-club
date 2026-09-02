<template>
  <div>
    <h1>招新意向</h1>
    <div class="table-wrap" style="margin-top:16px">
      <table>
        <thead>
          <tr><th>姓名</th><th>学号</th><th>联系</th><th>意向</th><th>时间</th></tr>
        </thead>
        <tbody>
          <tr v-for="r in rows" :key="r.id">
            <td>{{ r.name }}<br><span class="muted">{{ r.college }} {{ r.grade }}</span></td>
            <td>{{ r.studentId }}</td>
            <td>{{ r.phone }} / {{ r.qq }}<br>{{ r.email }}</td>
            <td>{{ r.department?.name || '未定' }} · {{ r.gameDirection }}</td>
            <td>{{ fmtDate(r.createdAt) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
const { data: rows } = await useFetch('/api/admin/recruit')
</script>
