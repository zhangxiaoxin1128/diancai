// 配置部分
const CONFIG = {
  SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbxh49W7rL9xuUF1FZIYxaQOVuOU2gQSuRKMexWyN1mf07DsH8zSI5zhbj1HyRARSPqG/exec',
};

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('order-form');
    const successMessage = document.getElementById('success-message');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // 显示加载状态
        const submitBtn = form.querySelector('.submit-btn');
        submitBtn.disabled = true;
        submitBtn.textContent = '提交中...';
        
        try {
            // 收集表单数据
            const formData = {
                name: document.getElementById('name').value.trim(),
                foods: Array.from(document.querySelectorAll('input[name="food"]:checked')).map(el => el.value),
                specialRequest: document.getElementById('special-request').value.trim(),
                time: document.getElementById('time').value,
                password: CONFIG.PASSWORD // 安全验证
            };
            
            // 基本验证
            if (!formData.name) throw new Error('请填写你的名字');
            if (formData.foods.length === 0) throw new Error('请至少选择一道菜');
            
            // 提交到Google Apps Script
            const response = await fetch(CONFIG.SCRIPT_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            
            if (!response.ok) throw new Error('网络响应不正常');
            
            const result = await response.json();
            if (!result.success) throw new Error(result.message);
            
            // 显示成功消息
            successMessage.classList.remove('hidden');
            form.reset();
            
        } catch (error) {
            alert('提交失败: ' + error.message);
            console.error('Error:', error);
        } finally {
            // 重置按钮状态
            submitBtn.disabled = false;
            submitBtn.textContent = '提交菜单';
        }
    });
    
    // 关闭成功消息
    document.getElementById('close-message').addEventListener('click', function() {
        successMessage.classList.add('hidden');
    });
});
