class MediaQuery {
  constructor(query, pc, sp) {
    this.query = query;
    this.pc = pc;
    this.sp = sp;
    this.mediaQueryList = window.matchMedia(`(min-width:${this.query}px)`);

    // リスナー登録
    // mediaQueryList.addListener(listener); // @deprecated
    this.mediaQueryList.addEventListener("change", this.listener.bind(this));
    // 初期化処理
    this.listener(this.mediaQueryList);
    /**
     * イベントリスナー
     */
  }
  listener(event) {
    // リサイズ時に行う処理
    console.log(event);
    if (event.matches) {
      // console.log('PC用ブレークポイント用処理');
      this.pc();
    } else {
      // console.log('SP用ブレークポイント用処理');
      this.sp();
    }
  }
}

export default MediaQuery;
