<template>
  <transition name="modal" appear>
    <div class="modal_overlay">
      <div class="modal_window">
        <div class="modal_content">
          <slot></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<style lang="scss" scoped>
.modal {
  &_overlay {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    z-index: 5;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    background-color: rgba(0, 0, 0, 0.7);
  }

  &_window {
    height: auto;
    width: 50%;
    overflow: hidden;
    background-color: #fcf5f5;
  }

  &_content {
    height: 100%;
    padding: 30px;
  }
}

// transition
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.4s;
  .modal__window {
    transition: opacity 0.4s, transform 0.4s;
  }
}
.modal-leave-active {
  transition: opacity 0.6s ease 0.4s;
}
.modal-enter,
.modal-leave-to {
  opacity: 0;
  .modal__window {
    opacity: 0;
    transform: translateY(-20px);
  }
}
</style>
