(function () {
  const provinceSelect = document.getElementById('provinceSelect');
  const wardSelect = document.getElementById('wardSelect');
  const streetAddress = document.getElementById('streetAddress');
  const provinceName = document.getElementById('provinceName');
  const wardName = document.getElementById('wardName');
  const shippingAddress = document.getElementById('shippingAddress');
  const addressPreview = document.getElementById('addressPreview');
  const addressError = document.getElementById('addressError');
  const checkoutForm = document.getElementById('checkoutForm');

  if (!provinceSelect || !wardSelect || !streetAddress || !checkoutForm) return;

  const API_BASE = 'https://provinces.open-api.vn/api/v2';
  let provinces = [];

  function setError(message) {
    addressError.style.display = message ? 'block' : 'none';
    addressError.textContent = message || '';
  }

  function setOptions(select, placeholder, items) {
    select.innerHTML = '';
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = placeholder;
    select.appendChild(defaultOption);

    items.forEach(function (item) {
      const option = document.createElement('option');
      option.value = item.code;
      option.textContent = item.name;
      option.dataset.name = item.name;
      select.appendChild(option);
    });
  }

  function selectedText(select) {
    const option = select.options[select.selectedIndex];
    return option && option.value ? (option.dataset.name || option.textContent).trim() : '';
  }

  function updateAddress() {
    const street = streetAddress.value.trim();
    const ward = selectedText(wardSelect);
    const province = selectedText(provinceSelect);

    provinceName.value = province;
    wardName.value = ward;

    const parts = [street, ward, province].filter(Boolean);
    shippingAddress.value = parts.join(', ');

    addressPreview.textContent = shippingAddress.value
      ? 'Địa chỉ giao hàng: ' + shippingAddress.value
      : 'Địa chỉ sẽ được ghép theo mô hình 2 cấp mới: Số nhà/đường, Xã/Phường, Tỉnh/Thành phố.';
  }

  async function fetchJson(url) {
    const response = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error('Không tải được dữ liệu địa chỉ');
    return response.json();
  }

  async function loadProvinces() {
    try {
      provinceSelect.disabled = true;
      setError('');
      const data = await fetchJson(API_BASE + '/?depth=1');
      provinces = Array.isArray(data) ? data : [];
      provinces.sort(function (a, b) { return a.name.localeCompare(b.name, 'vi'); });
      setOptions(provinceSelect, 'Chọn tỉnh/thành phố', provinces);
      provinceSelect.disabled = false;
    } catch (error) {
      setOptions(provinceSelect, 'Không tải được danh sách tỉnh/thành', []);
      setError('Không tải được danh sách địa chỉ mới. Vui lòng kiểm tra kết nối mạng rồi tải lại trang.');
    }
  }

  async function loadWards(provinceCode) {
    wardSelect.disabled = true;
    setOptions(wardSelect, 'Đang tải xã/phường...', []);
    wardName.value = '';
    updateAddress();

    if (!provinceCode) {
      setOptions(wardSelect, 'Chọn tỉnh/thành trước', []);
      return;
    }

    try {
      setError('');
      const province = await fetchJson(API_BASE + '/p/' + encodeURIComponent(provinceCode) + '?depth=2');
      const wards = Array.isArray(province.wards) ? province.wards : [];
      wards.sort(function (a, b) { return a.name.localeCompare(b.name, 'vi'); });
      setOptions(wardSelect, 'Chọn xã/phường/đặc khu', wards);
      wardSelect.disabled = false;
    } catch (error) {
      setOptions(wardSelect, 'Không tải được xã/phường', []);
      setError('Không tải được danh sách xã/phường của tỉnh đã chọn. Vui lòng thử lại.');
    }
  }

  provinceSelect.addEventListener('change', function () {
    updateAddress();
    loadWards(provinceSelect.value);
  });
  wardSelect.addEventListener('change', updateAddress);
  streetAddress.addEventListener('input', updateAddress);

  checkoutForm.addEventListener('submit', function (event) {
    updateAddress();
    if (!streetAddress.value.trim() || !provinceSelect.value || !wardSelect.value || !shippingAddress.value.trim()) {
      event.preventDefault();
      setError('Vui lòng nhập số nhà/đường và chọn đầy đủ Tỉnh/Thành phố, Xã/Phường theo địa chỉ 2 cấp mới.');
    }
  });

  loadProvinces();
})();
