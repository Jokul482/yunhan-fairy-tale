<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
import { updateManager } from "@/utils/sys";
onLaunch(() => {
  console.log("App Launch");
});
onShow(() => {
  console.log("App Show");
  updateManager();
});
onHide(() => {
  console.log("App Hide");
});
</script>
<style></style>
